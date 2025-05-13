import { NextRequest, NextResponse } from 'next/server';
import { getUserByFid } from '@/lib/db';
import { processTransaction } from '@/lib/blockchain';

// Helper function to get user FID from session cookie
async function getUserFromSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const session = JSON.parse(sessionCookie.value);
    return session.fid;
  } catch (error) {
    console.error('Error parsing session cookie:', error);
    return null;
  }
}

// POST /api/transactions/verify - Verify a transaction and generate moments
export async function POST(request: NextRequest) {
  try {
    const userFid = await getUserFromSession(request);
    
    if (!userFid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body.transactionHash) {
      return NextResponse.json(
        { error: 'Missing transactionHash field' },
        { status: 400 }
      );
    }
    
    // Get user details
    const user = await getUserByFid(userFid);
    
    if (!user || !user.wallet_address) {
      return NextResponse.json(
        { error: 'User wallet not connected' },
        { status: 400 }
      );
    }
    
    // Mock transaction details - in a real app, we'd fetch this from the blockchain
    const mockTransaction = {
      hash: body.transactionHash,
      from: user.wallet_address,
      to: body.contractAddress || '0x1234567890123456789012345678901234567890',
      value: BigInt("1000000000000000000"), // 1 ETH in wei
      // Add other transaction details as needed
    };
    
    // Process the transaction to generate moments
    const moments = await processTransaction(mockTransaction, user.wallet_address);
    
    return NextResponse.json({
      success: true,
      moments: moments || []
    });
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}