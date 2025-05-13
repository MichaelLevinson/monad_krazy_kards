"use client";

import { useState, useEffect } from 'react';

interface ScoreBoardProps {
  score: number;
  timeLeft: number;
  moves: number;
  level: number;
}

export default function ScoreBoard({ score, timeLeft, moves, level }: ScoreBoardProps) {
  // Use state instead of direct localStorage access to avoid hydration issues
  const [highScore, setHighScore] = useState('0');
  const [highLevel, setHighLevel] = useState('1');
  
  // Load localStorage values only on client side after component mounts
  useEffect(() => {
    setHighScore(localStorage.getItem('krazyKards-highScore') || '0');
    setHighLevel(localStorage.getItem('krazyKards-highLevel') || '1');
  }, []);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4 shadow-md">
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">Level</div>
          <div className="text-xl text-purple-700 dark:text-purple-400 font-bold">{level}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Best: {highLevel}</div>
        </div>
        
        <div className="text-center">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">Score</div>
          <div className="text-xl text-purple-700 dark:text-purple-400 font-bold">{score}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">High: {highScore}</div>
        </div>
        
        <div className="text-center">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">Time</div>
          <div className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-500 dark:text-red-400' : 'text-purple-700 dark:text-purple-400'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">&nbsp;</div>
        </div>
        
        <div className="text-center">
          <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">Moves</div>
          <div className="text-xl text-purple-700 dark:text-purple-400 font-bold">{moves}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">&nbsp;</div>
        </div>
      </div>
    </div>
  );
}