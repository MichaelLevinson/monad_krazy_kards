"use client";

import { useState, useEffect } from 'react';
import { MomentCard } from './MomentCard';
import { useAccount, useConnect } from 'wagmi';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import { Moment, User } from '@/types';

type DashboardProps = {
  user: User;
  isEthProviderAvailable: boolean;
};

export function Dashboard({ user, isEthProviderAvailable }: DashboardProps) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const [userMoments, setUserMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletConnecting, setWalletConnecting] = useState(false);
  
  useEffect(() => {
    async function fetchUserMoments() {
      try {
        setLoading(true);
        // In a real app, you'd fetch this from your API
        // For now we'll create some mock data
        const mockMoments: Moment[] = [
          {
            id: 1,
            fid: user.fid,
            momentType: 'first_transaction',
            title: 'First Transaction on Monad',
            description: "You've made your first transaction on the Monad network!",
            transactionHash: '0x123456789abcdef',
            createdAt: new Date().toISOString(),
            isRare: true
          },
          {
            id: 2,
            fid: user.fid,
            momentType: 'first_interaction',
            title: 'First Interaction',
            description: 'First time interacting with SwapDex',
            transactionHash: '0x987654321fedcba',
            contractAddress: '0x1234567890',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isRare: false
          }
        ];
        
        setUserMoments(mockMoments);
      } catch (error) {
        console.error('Error fetching user moments:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserMoments();
  }, [user]);
  
  const handleConnectWallet = async () => {
    if (!isEthProviderAvailable) return;
    
    try {
      setWalletConnecting(true);
      connect({ connector: farcasterFrame() });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setWalletConnecting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={user.pfpUrl || 'https://cdn.stamp.fyi/avatar/eth:0x0000000000000000000000000000000000000000?s=300'}
            alt={user.username}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold dark:text-white">
              {user.displayName || user.username}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
            
            {address ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Wallet: {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </p>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={!isEthProviderAvailable || walletConnecting}
                className={`mt-2 text-xs px-3 py-1 rounded-md ${
                  isEthProviderAvailable
                    ? 'bg-monad-primary text-white hover:bg-monad-secondary'
                    : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                }`}
              >
                {walletConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Your Moments
            </h3>
            <p className="text-2xl font-bold dark:text-white">{userMoments.length}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Rare Moments
            </h3>
            <p className="text-2xl font-bold dark:text-white">
              {userMoments.filter(m => m.isRare).length}
            </p>
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Your Recent Moments</h3>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-2">
            <div className="w-2 h-2 bg-monad-primary rounded-full"></div>
            <div className="w-2 h-2 bg-monad-primary rounded-full"></div>
            <div className="w-2 h-2 bg-monad-primary rounded-full"></div>
          </div>
        </div>
      ) : userMoments.length > 0 ? (
        <div className="space-y-4">
          {userMoments.map(moment => (
            <MomentCard
              key={moment.id}
              moment={moment}
              user={user}
            />
          ))}
          {userMoments.length > 3 && (
            <div className="text-center py-2">
              <a 
                href="/moments"
                className="text-monad-primary hover:text-monad-secondary"
              >
                View all your moments →
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            You haven't created any moments yet.
            <br />
            {isConnected 
              ? "Complete some transactions on Monad to get started!"
              : "Connect your wallet to get started!"}
          </p>
        </div>
      )}
    </div>
  );
}