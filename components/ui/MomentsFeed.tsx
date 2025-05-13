"use client";

import { useState, useEffect } from 'react';
import { MomentCard } from './MomentCard';
import { Moment, User } from '@/types';
import { DEFAULT_LIMIT } from '@/lib/constants';

type FeedType = 'friends' | 'all';

type MomentsFeedProps = {
  user: User;
};

export function MomentsFeed({ user }: MomentsFeedProps) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [feedType, setFeedType] = useState<FeedType>('friends');
  
  useEffect(() => {
    // Reset state when feed type changes
    setMoments([]);
    setOffset(0);
    setHasMore(true);
    setLoading(true);
    setError(null);
    
    fetchMoments();
  }, [feedType, user]);
  
  const fetchMoments = async () => {
    try {
      setLoading(true);
      
      // In a real app, you'd fetch this from your API
      // For now, we'll create mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const mockFriendMoments: Moment[] = [
        {
          id: 3,
          fid: 54321,
          momentType: 'first_interaction',
          title: 'First Protocol Interaction',
          description: 'First time using MonadSwap!',
          transactionHash: '0xabcdef123456',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isRare: false,
          username: 'alice',
          displayName: 'Alice',
          pfpUrl: 'https://cdn.stamp.fyi/avatar/eth:0x1111111111111111111111111111111111111111?s=300'
        },
        {
          id: 4,
          fid: 65432,
          momentType: 'high_value',
          title: 'Whale Alert',
          description: 'Sent 100 MONAD',
          transactionHash: '0xfedcba654321',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          isRare: true,
          username: 'bob',
          displayName: 'Bob',
          pfpUrl: 'https://cdn.stamp.fyi/avatar/eth:0x2222222222222222222222222222222222222222?s=300'
        }
      ];
      
      const mockGlobalMoments: Moment[] = [
        ...mockFriendMoments,
        {
          id: 5,
          fid: 76543,
          momentType: 'milestone',
          title: '10th Transaction',
          description: 'Completed 10 transactions on Monad!',
          transactionHash: '0x111222333444',
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          isRare: false,
          username: 'charlie',
          displayName: 'Charlie',
          pfpUrl: 'https://cdn.stamp.fyi/avatar/eth:0x3333333333333333333333333333333333333333?s=300'
        }
      ];
      
      const newMoments = feedType === 'friends' ? mockFriendMoments : mockGlobalMoments;
      
      if (newMoments.length < DEFAULT_LIMIT) {
        setHasMore(false);
      }
      
      setMoments(prev => [...prev, ...newMoments]);
      setOffset(prev => prev + newMoments.length);
    } catch (err) {
      setError('Error loading moments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchMoments();
    }
  };
  
  const handleShareSuccess = (momentId: number) => {
    // Could implement analytics or feedback here
    console.log(`Moment ${momentId} shared successfully`);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Feed type selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              feedType === 'friends'
                ? 'bg-monad-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
            onClick={() => setFeedType('friends')}
          >
            Friends
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              feedType === 'all'
                ? 'bg-monad-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
            onClick={() => setFeedType('all')}
          >
            Everyone
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && moments.length === 0 && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            {feedType === 'friends' 
              ? "Your friends haven't created any moments yet."
              : "No moments found. Be the first to create one!"}
          </p>
        </div>
      )}
      
      {/* Moments list */}
      <div className="space-y-4">
        {moments.map(moment => (
          <MomentCard
            key={moment.id}
            moment={moment}
            user={{
              fid: moment.fid,
              username: moment.username || '',
              displayName: moment.displayName,
              pfpUrl: moment.pfpUrl
            }}
            onShare={handleShareSuccess}
          />
        ))}
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse flex space-x-2">
            <div className="w-2 h-2 bg-monad-primary rounded-full"></div>
            <div className="w-2 h-2 bg-monad-primary rounded-full"></div>
            <div className="w-2 h-2 bg-monad-primary rounded-full"></div>
          </div>
        </div>
      )}
      
      {/* Load more button */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-monad-primary text-white rounded-md hover:bg-monad-secondary transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}