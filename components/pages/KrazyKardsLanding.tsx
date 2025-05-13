"use client";

import { useState, useEffect } from "react";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import Link from "next/link";
import sdk from "@farcaster/frame-sdk";

export default function KrazyKardsLanding() {
  const { context } = useMiniAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsLoading(false);

    // Tell the Farcaster SDK we're ready to display content
    const signalReady = async () => {
      if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
        try {
          console.log("KrazyKardsLanding component calling ready()");
          await sdk.actions.ready();
        } catch (error) {
          console.error("Error calling ready from KrazyKardsLanding:", error);
        }
      }
    };
    
    signalReady();
  }, []);

  // Signal ready when loading state changes
  useEffect(() => {
    if (!isLoading && sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
      console.log("Content loaded, calling ready()");
      sdk.actions.ready().catch(e => console.error("Error calling ready after load:", e));
    }
  }, [isLoading]);

  if (!isClient || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  const userName = context?.user?.displayName || context?.user?.username || "Player";

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900/30 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-3">🃏</div>
        <h1 className="text-3xl font-bold mb-2 text-purple-600 dark:text-purple-400">
          Monad Krazy Kards
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The social card matching game that tests your memory and speed!
        </p>
        
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-6">
          <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
            Welcome, {userName}!
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Match cards to earn points and reach the top of the leaderboard!
          </p>
        </div>
        
        <Link 
          href="/game" 
          className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition duration-300"
        >
          Play Now!
        </Link>
        
        <div className="mt-6 flex justify-center space-x-4">
          <div className="text-center">
            <div className="text-3xl mb-1">⏱️</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Beat the Timer</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">🏆</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Top the Leaderboard</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">🚀</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Level Up</p>
          </div>
        </div>
      </div>
    </div>
  );
}