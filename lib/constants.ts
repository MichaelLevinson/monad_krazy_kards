// Application URLs
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Blockchain
export const MONAD_RPC_URL = process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'https://rpc.testnet.monad.network';
export const MONAD_EXPLORER_URL = 'https://testnet.monadexplorer.com';
export const MONAD_CHAIN_ID = 42113;

// Paging and limits
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Moment types
export const MOMENT_TYPES = {
  FIRST_TRANSACTION: 'first_transaction',
  FIRST_INTERACTION: 'first_interaction',
  HIGH_VALUE: 'high_value',
  MILESTONE: 'milestone',
  NEW_CONTRACT: 'new_contract',
  CUSTOM: 'custom'
};