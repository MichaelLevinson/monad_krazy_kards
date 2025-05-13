"use client";

import { useState, useEffect } from 'react';

interface WinModalProps {
  score: number;
  level: number;
  isWin: boolean;
  onClose: () => void;
  onRestart: () => void;
  onNextLevel: () => void;
  onShare: () => void;
}

export default function WinModal({ score, level, isWin, onClose, onRestart, onNextLevel, onShare }: WinModalProps) {
  // Use state for localStorage values
  const [highScore, setHighScore] = useState(0);
  const [highLevel, setHighLevel] = useState(1);
  const [isHighScore, setIsHighScore] = useState(false);
  const [isHighLevel, setIsHighLevel] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [canAdvance, setCanAdvance] = useState(false);
  
  // Load and compare localStorage values after component mounts
  useEffect(() => {
    // Get high score and level from localStorage
    const storedHighScore = parseInt(localStorage.getItem('krazyKards-highScore') || '0', 10);
    const storedHighLevel = parseInt(localStorage.getItem('krazyKards-highLevel') || '1', 10);
    
    // Check if level is completed
    const completedLevelsStr = localStorage.getItem('krazyKards-completedLevels') || '';
    const completedLevels = completedLevelsStr ? completedLevelsStr.split(',').map(Number) : [];
    
    // Current level is completed if we won or it appears in the completed levels list
    const currentLevelCompleted = isWin || completedLevels.includes(level);
    
    // Can only advance if current level is completed
    const allowAdvance = currentLevelCompleted;
    
    setHighScore(storedHighScore);
    setHighLevel(storedHighLevel);
    setIsHighScore(score > storedHighScore);
    setIsHighLevel(level > storedHighLevel);
    setLevelCompleted(currentLevelCompleted);
    setCanAdvance(allowAdvance);
  }, [score, level, isWin]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-purple-600 dark:text-purple-400">
            {isWin ? '🎉 Level Complete! 🎉' : '⏱️ Time\'s Up! ⏱️'}
          </h2>
          
          <div className="mt-4 mb-6">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{score}</div>
            <div className="text-gray-600 dark:text-gray-300">POINTS</div>
            
            <div className="flex justify-center items-center mt-2 space-x-2">
              <div className="text-center px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full">
                <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">Level {level}</span>
              </div>
              
              {isHighScore && (
                <div className="text-center px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full animate-pulse">
                  <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                    New High Score!
                  </span>
                </div>
              )}
              
              {isHighLevel && (
                <div className="text-center px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full animate-pulse">
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    New Record!
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Your score has been added to the leaderboard!
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {canAdvance ? (
              <button
                onClick={onNextLevel}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                Next Level 🚀
              </button>
            ) : !isWin ? (
              <div className="text-center py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
                Complete this level to advance
              </div>
            ) : null}
            
            <button
              onClick={onRestart}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-purple-700 transition-colors"
            >
              {isWin ? 'Restart From Level 1' : 'Try Again'}
            </button>
            
            <button
              onClick={onShare}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-600 transition-colors"
            >
              Share Score on Farcaster
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}