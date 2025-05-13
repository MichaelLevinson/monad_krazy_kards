"use client";

import { useState } from 'react';
import { useMiniAppContext } from '@/hooks/use-miniapp-context';
import { APP_URL, MONAD_EXPLORER_URL } from '@/lib/constants';
import { Moment, User } from '@/types';

type MomentCardProps = {
  moment: Moment;
  user: User;
  onShare?: (id: number) => void;
};

export function MomentCard({ moment, user, onShare }: MomentCardProps) {
  const { actions } = useMiniAppContext();
  const [isSharing, setIsSharing] = useState(false);
  const [showTipMessage, setShowTipMessage] = useState(false);
  
  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      // Share to Farcaster using the miniapp context
      if (actions?.composeCast) {
        await actions.composeCast({
          text: `Check out my "${moment.title}" moment on Monad Moments! 🚀`,
          embeds: [`${APP_URL}/moments/${moment.id}`]
        });
        
        if (onShare) {
          onShare(moment.id);
        }
      } else {
        console.error('Farcaster actions not available');
      }
    } catch (error) {
      console.error('Error sharing moment:', error);
    } finally {
      setIsSharing(false);
    }
  };
  
  const handleTipClick = () => {
    // For Phase 1, just show "coming soon" message
    setShowTipMessage(true);
    setTimeout(() => setShowTipMessage(false), 3000);
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 ${moment.isRare ? 'border-2 border-monad-primary' : ''}`}>
      {/* User info */}
      <div className="flex items-center mb-3">
        <img 
          src={user.pfpUrl || 'https://cdn.stamp.fyi/avatar/eth:0x0000000000000000000000000000000000000000?s=300'} 
          alt={user.username} 
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-medium dark:text-white">{user.displayName || user.username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
        </div>
      </div>
      
      {/* Moment content */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg dark:text-white">{moment.title}</h3>
          {moment.isRare && (
            <span className="ml-2 px-2 py-1 text-xs bg-monad-light text-white rounded-full">
              Rare
            </span>
          )}
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-1">{moment.description}</p>
        
        {moment.customMessage && (
          <p className="text-gray-600 dark:text-gray-400 mt-2 italic">
            "{moment.customMessage}"
          </p>
        )}
        
        {moment.transactionHash && (
          <a 
            href={`${MONAD_EXPLORER_URL}/tx/${moment.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-monad-primary mt-2 block"
          >
            View transaction ↗
          </a>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex justify-between mt-4">
        <button 
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center text-sm text-monad-primary transition-colors hover:text-monad-secondary disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span className="ml-1">{isSharing ? 'Sharing...' : 'Share'}</span>
        </button>
        
        {/* Tip button - disabled for Phase 1 */}
        <div className="relative">
          <button 
            onClick={handleTipClick}
            className="flex items-center text-sm text-gray-400 cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span className="ml-1">Tip (Coming Soon)</span>
          </button>
          
          {showTipMessage && (
            <div className="absolute right-0 bottom-8 bg-gray-800 text-white text-xs p-2 rounded shadow-lg whitespace-nowrap">
              Tipping will be available in a future update
            </div>
          )}
        </div>
      </div>
      
      {/* Timestamp */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        {new Date(moment.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}