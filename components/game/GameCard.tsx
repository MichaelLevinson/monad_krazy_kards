"use client";

import { useState, useEffect } from 'react';

interface GameCardProps {
  card: {
    id: number;
    type: string;
    value: string;
    imageUrl: string;
  };
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function GameCard({ card, isFlipped, isMatched, onClick }: GameCardProps) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (isMatched) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isMatched]);
  
  return (
    <div 
      className={`relative cursor-pointer transition-all duration-300 h-24 sm:h-28 md:h-32
                 ${isMatched ? 'opacity-70' : 'opacity-100'}
                 ${animate ? 'animate-pulse' : ''}
                 transform ${isFlipped ? 'rotateY(180deg)' : ''}`}
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      <div className={`absolute inset-0 w-full h-full transition-all duration-300 transform-style-preserve-3d 
                      ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Card Back */}
        <div 
          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 
                     rounded-lg shadow-lg flex items-center justify-center
                     backface-hidden ${isFlipped ? 'invisible' : 'visible'}`}
        >
          <div className="text-white text-3xl font-bold">🃏</div>
        </div>
        
        {/* Card Front */}
        <div 
          className={`absolute inset-0 w-full h-full rounded-lg shadow-lg flex items-center justify-center
                     backface-hidden rotate-y-180 ${isFlipped ? 'visible' : 'invisible'}
                     ${card.type === 'monad' ? 'bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700' : ''}
                     ${card.type === 'friend' ? 'bg-gradient-to-r from-blue-200 to-green-200 dark:from-blue-800 dark:to-green-700' : ''}`}
        >
          {card.type === 'friend' ? (
            <div className="flex flex-col items-center">
              <img 
                src={card.imageUrl} 
                alt={card.value}
                className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" 
              />
              <span className="text-xs mt-1 text-center font-bold text-gray-900 dark:text-white">{card.value}</span>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-3xl">{card.imageUrl}</div>
              <div className="text-xs font-bold mt-1 text-gray-900 dark:text-white">{card.value}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}