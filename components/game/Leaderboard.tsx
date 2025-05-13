"use client";

import { useState, useEffect } from 'react';

// Define the structure for leaderboard entries
interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Generate initial leaderboard data if none exists in localStorage
    const storedLeaderboard = localStorage.getItem('krazyKards-leaderboard');
    
    if (!storedLeaderboard) {
      // Generate random funny names and scores for initial leaderboard
      const funnyNames = [
        "HODL Hank", "Diamond Dani", "Monad Maxi", "Degen Dave", 
        "Gas Fee Gabe", "Whale Wanda", "Rug Pull Randy", "FOMO Fred",
        "Moon Molly", "Lambo Larry", "NFT Nancy", "Pump Patty",
        "Dump Doug", "Crypto Chad", "Staking Sally", "Yield Yvonne",
        "Liquidity Lisa", "APE Andy", "Airdrop Alex", "Miner Mike"
      ];
      
      // Shuffle the names
      const shuffledNames = [...funnyNames].sort(() => Math.random() - 0.5);
      
      // Generate scores between 10-49 for initial data
      const initialLeaderboard = shuffledNames.slice(0, 20).map((name, index) => ({
        name,
        score: Math.floor(Math.random() * 40) + 10,
        level: Math.floor(Math.random() * 2) + 1 // Level 1-2 for initial entries
      }));
      
      // Sort by score descending
      initialLeaderboard.sort((a, b) => b.score - a.score);
      
      // Store in localStorage
      localStorage.setItem('krazyKards-leaderboard', JSON.stringify(initialLeaderboard));
      setLeaderboard(initialLeaderboard);
    } else {
      // Load existing leaderboard
      setLeaderboard(JSON.parse(storedLeaderboard));
    }
  }, []);
  
  // If we're server-side rendering or haven't initialized client-side yet,
  // show a loading state to avoid hydration errors
  if (!isClient) {
    return (
      <div className="w-full mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-3">
          🏆 Leaderboard
        </h2>
        <div className="animate-pulse flex flex-col space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-purple-200 dark:bg-purple-700 rounded w-1/3"></div>
              <div className="h-4 bg-purple-200 dark:bg-purple-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-3">
        🏆 Leaderboard
      </h2>
      
      <div className="max-h-60 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-purple-200 dark:border-purple-700">
              <th className="py-2">#</th>
              <th className="py-2">Player</th>
              <th className="py-2 text-right">Score</th>
              <th className="py-2 text-right">Level</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index} className={
                "border-b border-purple-100 dark:border-purple-800/50 " + 
                (index < 3 ? "font-semibold" : "")
              }>
                <td className="py-2">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && (index + 1)}
                </td>
                <td className="py-2">{entry.name}</td>
                <td className="py-2 text-right">{entry.score}</td>
                <td className="py-2 text-right">{entry.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}