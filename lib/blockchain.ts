import { createPublicClient, http, formatEther, formatUnits } from 'viem';
import { MONAD_RPC_URL, MOMENT_TYPES } from './constants';
import { createMoment, checkFirstInteraction, getUserByWallet } from './db';

// Initialize Viem client
const monadClient = createPublicClient({
  transport: http(MONAD_RPC_URL)
});

// Function to get the name of a contract (simplified for Phase 1)
async function getContractName(address: string): Promise<string> {
  // In a real implementation, this would query a contract registry or use ENS
  // For Phase 1, we'll return a placeholder
  return `Contract ${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Get recent transactions for a wallet
export async function getWalletTransactions(address: string, limit = 10) {
  try {
    // This is a simplification - for production you'd use a proper indexer
    const blockNumber = await monadClient.getBlockNumber();
    
    // Start from recent blocks and work backward
    const transactions = [];
    let currentBlock = blockNumber;
    let blocksScanned = 0;
    
    while (transactions.length < limit && blocksScanned < 50) {
      const block = await monadClient.getBlock({
        blockNumber: currentBlock,
        includeTransactions: true
      });
      
      // Filter transactions for the target address
      const addressTxs = block.transactions.filter(
        tx => tx.from.toLowerCase() === address.toLowerCase() || 
             (tx.to && tx.to.toLowerCase() === address.toLowerCase())
      );
      
      transactions.push(...addressTxs);
      currentBlock = currentBlock - 1n;
      blocksScanned++;
    }
    
    return transactions.slice(0, limit);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

// Check if an address is a contract
export async function isContract(address: string): Promise<boolean> {
  try {
    const code = await monadClient.getBytecode({ address });
    // No bytecode means it's not a contract
    return code !== undefined && code !== '0x';
  } catch (error) {
    console.error('Error checking contract status:', error);
    return false;
  }
}

// Get contract details
export async function getContractDetails(address: string) {
  try {
    const code = await monadClient.getBytecode({ address });
    
    // No bytecode means it's not a contract
    if (!code || code === '0x') {
      return null;
    }
    
    // Get transaction count as a simple popularity metric
    const txCount = await monadClient.getTransactionCount({ address });
    
    return {
      address,
      bytecodeSize: code.length,
      transactionCount: Number(txCount)
    };
  } catch (error) {
    console.error('Error fetching contract details:', error);
    return null;
  }
}

// Process a transaction to check for moments
export async function processTransaction(tx: any, userAddress: string) {
  const { from, to, value, hash } = tx;
  const fromAddress = from.toLowerCase();
  
  try {
    // Get user by wallet address
    const user = await getUserByWallet(fromAddress);
    if (!user) return null; // Not a tracked user
    
    const moments = [];
    
    // Check for first transaction (if this is the user's first detected transaction)
    // This is simplified - in production you'd check the database
    const isFirstTransaction = user.first_seen === user.last_active;
    if (isFirstTransaction) {
      const firstMoment = await createMoment({
        fid: user.fid,
        momentType: MOMENT_TYPES.FIRST_TRANSACTION,
        title: 'First Transaction on Monad',
        description: 'You\'ve made your first transaction on the Monad network!',
        transactionHash: hash,
        contractAddress: to,
        isRare: true,
        metadata: { value: formatEther(value) }
      });
      moments.push(firstMoment);
    }
    
    // Check for first-time interaction with a contract
    if (to && await isContract(to)) {
      const isFirstInteraction = await checkFirstInteraction(user.fid, to);
      if (isFirstInteraction) {
        const contractName = await getContractName(to);
        const interactionMoment = await createMoment({
          fid: user.fid,
          momentType: MOMENT_TYPES.FIRST_INTERACTION,
          title: 'First Interaction',
          description: `First time interacting with ${contractName}`,
          transactionHash: hash,
          contractAddress: to,
          isRare: false,
          metadata: { contractName }
        });
        moments.push(interactionMoment);
      }
    }
    
    // Check for high-value transactions
    // 10 ETH threshold - adjust as needed
    const thresholdHighValue = 10n * 10n**18n;
    if (value > thresholdHighValue) {
      const whaleMoment = await createMoment({
        fid: user.fid,
        momentType: MOMENT_TYPES.HIGH_VALUE,
        title: 'Whale Alert',
        description: `Sent ${formatEther(value)} MONAD`,
        transactionHash: hash,
        contractAddress: to,
        isRare: true,
        metadata: { value: formatEther(value) }
      });
      moments.push(whaleMoment);
    }
    
    return moments.filter(Boolean);
  } catch (error) {
    console.error('Error processing transaction for moments:', error);
    return null;
  }
}

// Function to check a user's latest transactions
export async function checkUserTransactions(fid: number, walletAddress: string) {
  try {
    const transactions = await getWalletTransactions(walletAddress, 5);
    const results = [];
    
    for (const tx of transactions) {
      const momentResults = await processTransaction(tx, walletAddress);
      if (momentResults) {
        results.push(...momentResults);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error checking user transactions:', error);
    return [];
  }
}