export interface SafeAreaInsets {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface User {
  fid: number;
  username: string;
  displayName?: string;
  pfpUrl?: string;
  walletAddress?: string;
}

export interface Moment {
  id: number;
  fid: number;
  momentType: string;
  title: string;
  description: string;
  transactionHash?: string;
  contractAddress?: string;
  customMessage?: string;
  createdAt: string;
  imageUrl?: string;
  isRare: boolean;
  metadata?: any;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}