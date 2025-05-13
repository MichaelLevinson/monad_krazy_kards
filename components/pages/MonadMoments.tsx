"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "@/components/ui/Dashboard";
import { MomentsFeed } from "@/components/ui/MomentsFeed";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { User } from "@/types";
import sdk from "@farcaster/frame-sdk";

type Tab = "dashboard" | "feed";

export default function MonadMoments() {
  const { context, actions, isEthProviderAvailable } = useMiniAppContext();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If we have Farcaster context, set the user
    if (context?.user) {
      // Create user object with safe property access
      const farcasterUser: User = {
        fid: context.user.fid || 0,
        username: context.user.username || `user${context.user.fid || 0}`, // Fallback username
        displayName: context.user.displayName || 'Farcaster User',
        pfpUrl: 'https://cdn.stamp.fyi/avatar/eth:0x0000000000000000000000000000000000000000?s=300', // Default avatar
      };
      setUser(farcasterUser);
    }
    setIsLoading(false);

    // Tell the Farcaster SDK we're ready to display content
    const signalReady = async () => {
      if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
        try {
          console.log("MonadMoments component calling ready()");
          await sdk.actions.ready();
        } catch (error) {
          console.error("Error calling ready from MonadMoments:", error);
        }
      }
    };
    
    signalReady();
  }, [context]);

  // Signal ready when loading state changes
  useEffect(() => {
    if (!isLoading && sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
      console.log("Content loaded, calling ready()");
      sdk.actions.ready().catch(e => console.error("Error calling ready after load:", e));
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-monad-primary rounded-full"></div>
          <div className="w-3 h-3 bg-monad-primary rounded-full"></div>
          <div className="w-3 h-3 bg-monad-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-2 text-monad-primary">Welcome to Monad Moments!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Discover, share, and celebrate your journey on the Monad blockchain.
          </p>
          
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Open Monad Moments in Warpcast to connect with your Farcaster account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <header className="bg-white dark:bg-gray-800 shadow-sm fixed bottom-0 left-0 right-0 z-10">
        <div className="max-w-5xl mx-auto">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 py-4 text-center ${
                activeTab === "dashboard"
                  ? "text-monad-primary border-t-2 border-monad-primary"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 mx-auto" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              <span className="text-xs mt-1 block">Profile</span>
            </button>
            
            <button
              onClick={() => setActiveTab("feed")}
              className={`flex-1 py-4 text-center ${
                activeTab === "feed"
                  ? "text-monad-primary border-t-2 border-monad-primary"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 mx-auto" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
                />
              </svg>
              <span className="text-xs mt-1 block">Feed</span>
            </button>
          </nav>
        </div>
      </header>
      
      <main className="pt-6 px-4 max-w-5xl mx-auto">
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold text-monad-primary">
            Monad Moments
          </h1>
        </div>
        
        {activeTab === "dashboard" ? (
          <Dashboard 
            user={user} 
            isEthProviderAvailable={isEthProviderAvailable} 
          />
        ) : (
          <MomentsFeed user={user} />
        )}
      </main>
    </div>
  );
}