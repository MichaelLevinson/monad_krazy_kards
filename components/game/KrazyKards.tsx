"use client";

import { useState, useEffect } from 'react';
import { useMiniAppContext } from '@/hooks/use-miniapp-context';
import { useAccount, useConnect } from 'wagmi';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import GameCard from './GameCard';
import ScoreBoard from './ScoreBoard';
import GameControls from './GameControls';
import WinModal from './WinModal';
import Leaderboard from './Leaderboard';
import { generateCards, shuffleCards, checkForMatch, getLevelConfig, getMockFriends } from '@/lib/game-utils';

export default function KrazyKards() {
  // Game state
  const [cards, setCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // Default 60 second game
  const [gameStarted, setGameStarted] = useState(false);
  const [tipTarget, setTipTarget] = useState<any>(null);
  const [level, setLevel] = useState(1);
  const [levelConfig, setLevelConfig] = useState(getLevelConfig(1));
  const [gridSize, setGridSize] = useState(4);
  const [isClient, setIsClient] = useState(false);
  
  // Farcaster integration
  const { context, actions } = useMiniAppContext();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  // Set isClient true once component mounts to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize the game
  useEffect(() => {
    if (isClient) {
      initializeGame(level);
    }
  }, [context, isClient]);

  // Set up level configuration
  useEffect(() => {
    if (isClient) {
      const config = getLevelConfig(level);
      setLevelConfig(config);
      setGridSize(config.gridSize);
      setTimeLeft(config.time);
    }
  }, [level, isClient]);

  // Timer countdown
  useEffect(() => {
    if (!isClient || !gameStarted || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          checkForWin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, isClient]);

  // Check for matches when cards are flipped
  useEffect(() => {
    if (!isClient || flippedIndices.length !== 2) return;
    
    const [firstIndex, secondIndex] = flippedIndices;
    
    // Check if cards match
    if (checkForMatch(cards[firstIndex], cards[secondIndex])) {
      // Cards match!
      setMatchedPairs(prev => [...prev, firstIndex, secondIndex]);
      
      // Calculate score based on level
      // More points for faster matches and higher levels
      const timeBonus = Math.floor(timeLeft / 3);
      const pointsEarned = Math.round((10 + timeBonus) * levelConfig.scoreMultiplier);
      setScore(prev => prev + pointsEarned);
      
      // Check if one of the cards is a friend card for tipping
      if (cards[firstIndex].type === 'friend' || cards[secondIndex].type === 'friend') {
        const friendCard = cards[firstIndex].type === 'friend' ? cards[firstIndex] : cards[secondIndex];
        setTipTarget(friendCard);
      }
    }
    
    // Reset flipped cards after a delay
    setTimeout(() => {
      setFlippedIndices([]);
      setMoves(prev => prev + 1);
    }, 1000);
  }, [flippedIndices, cards, levelConfig, timeLeft, isClient]);

  // Check if game is won when matches are made
  useEffect(() => {
    if (!isClient) return;
    
    if (matchedPairs.length > 0 && matchedPairs.length === cards.length) {
      setGameOver(true);
      checkForWin();
    }
  }, [matchedPairs, cards.length, isClient]);

  function initializeGame(gameLevel: number) {
    // Get level configuration
    const config = getLevelConfig(gameLevel);
    setLevelConfig(config);
    setGridSize(config.gridSize);
    
    // Generate cards with friends if available
    let friendsData: Array<{
      fid: number;
      username: string;
      displayName: string;
      pfpUrl: string;
    }> = [];
    
    // If we have Farcaster context, get some friends
    if (context?.user) {
      // In a real implementation, we'd use actual friend data based on user.following
      // For now, we'll use mock data regardless of context
      friendsData = getMockFriends();
    }
    
    const newCards = generateCards(config.pairs, friendsData);
    setCards(shuffleCards(newCards));
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore(gameLevel === 1 ? 0 : score); // Keep score if progressing levels
    setMoves(0);
    setGameOver(false);
    setTimeLeft(config.time);
    setGameStarted(true);
    setLevel(gameLevel);
  }

  function handleCardClick(index: number) {
    // Ignore clicks if game over or card already matched/flipped
    if (
      gameOver || 
      matchedPairs.includes(index) || 
      flippedIndices.includes(index) || 
      flippedIndices.length >= 2
    ) {
      return;
    }
    
    // Flip the card
    setFlippedIndices(prev => [...prev, index]);
  }

  function restartGame() {
    initializeGame(1); // Restart from level 1
    setScore(0); // Reset score
    setShowWinModal(false);
  }

  function goToNextLevel() {
    initializeGame(level + 1);
    setShowWinModal(false);
  }

  function checkForWin() {
    if (!isClient) return;
    
    const isWin = matchedPairs.length === cards.length;
    
    // Save high score to localStorage if higher
    const highScore = parseInt(localStorage.getItem('krazyKards-highScore') || '0', 10);
    if (score > highScore) {
      localStorage.setItem('krazyKards-highScore', score.toString());
    }
    
    // Track completed levels in localStorage
    const completedLevelsStr = localStorage.getItem('krazyKards-completedLevels') || '';
    const completedLevels = completedLevelsStr ? completedLevelsStr.split(',').map(Number) : [];
    
    // Only add the level to completed levels if it's a win and not already completed
    if (isWin && !completedLevels.includes(level)) {
      completedLevels.push(level);
      localStorage.setItem('krazyKards-completedLevels', completedLevels.join(','));
    }
    
    // Save high level to localStorage if higher
    const highLevel = parseInt(localStorage.getItem('krazyKards-highLevel') || '1', 10);
    if (level > highLevel) {
      localStorage.setItem('krazyKards-highLevel', level.toString());
    }
    
    // Update leaderboard if score is good enough
    updateLeaderboard();
    
    setShowWinModal(true);
  }
  
  function updateLeaderboard() {
    try {
      // Get current leaderboard
      const storedLeaderboard = localStorage.getItem('krazyKards-leaderboard');
      let leaderboard = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
      
      // Add the current score if it's not a test/dummy score
      if (score > 0) {
        // Use FID or a random name if not available
        const playerName = context?.user?.displayName || 
                          context?.user?.username || 
                          `Player ${Math.floor(Math.random() * 1000)}`;
        
        leaderboard.push({
          name: playerName,
          score: score,
          level: level
        });
        
        // Sort by score descending
        leaderboard.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
        
        // Keep only top 20
        leaderboard = leaderboard.slice(0, 20);
        
        // Save back to localStorage
        localStorage.setItem('krazyKards-leaderboard', JSON.stringify(leaderboard));
      }
    } catch (e) {
      console.error("Error updating leaderboard:", e);
    }
  }

  function handleTip() {
    if (!isConnected) {
      connect({ connector: farcasterFrame() });
    } else if (tipTarget) {
      // For now, just mock the tipping
      alert(`Tipped ${tipTarget.value} 0.01 MONAD!`);
      setTipTarget(null);
    }
  }

  function handleShare() {
    if (actions?.composeCast) {
      actions.composeCast({
        text: `🃏 Level ${level} completed with ${score} points in Monad Krazy Kards! Can you beat that? #MonadKrazyKards`,
        embeds: []
      });
    }
    setShowWinModal(false);
  }

  // Determine grid template based on level
  const gridTemplate = {
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }[gridSize] || 'grid-cols-4';

  // If we're server-side rendering or haven't initialized client-side yet,
  // show a loading state to avoid hydration errors
  if (!isClient) {
    return (
      <div className="flex flex-col items-center p-4 pt-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-purple-600 dark:text-purple-400">
          🃏 MONAD KRAZY KARDS 🃏
        </h1>
        <div className="h-96 w-full flex items-center justify-center">
          <div className="animate-pulse flex space-x-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 pt-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2 text-purple-600 dark:text-purple-400">
        🃏 MONAD KRAZY KARDS 🃏
      </h1>
      
      <ScoreBoard score={score} timeLeft={timeLeft} moves={moves} level={level} />
      
      {/* Game grid */}
      <div className={`grid ${gridTemplate} gap-2 w-full mt-4`}>
        {cards.map((card, index) => (
          <GameCard
            key={index}
            card={card}
            isFlipped={flippedIndices.includes(index) || matchedPairs.includes(index)}
            isMatched={matchedPairs.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      
      <GameControls 
        onRestart={restartGame}
        gameOver={gameOver}
      />
      
      {/* Leaderboard */}
      <Leaderboard />
      
      {tipTarget && (
        <div className="fixed bottom-20 left-0 right-0 bg-purple-100 dark:bg-purple-900 p-3 shadow-lg flex items-center justify-between z-10">
          <div className="flex items-center">
            <img 
              src={tipTarget.imageUrl} 
              alt={tipTarget.value}
              className="w-10 h-10 rounded-full mr-2" 
            />
            <div>
              <p className="font-bold dark:text-white">Match found: {tipTarget.value}!</p>
              <p className="text-xs dark:text-gray-300">Send a tip?</p>
            </div>
          </div>
          <button 
            onClick={handleTip}
            className="bg-purple-600 text-white px-3 py-1 rounded-md"
          >
            Tip 0.01 MONAD
          </button>
        </div>
      )}
      
      {showWinModal && (
        <WinModal
          score={score}
          level={level}
          isWin={matchedPairs.length === cards.length}
          onClose={() => setShowWinModal(false)}
          onRestart={restartGame}
          onNextLevel={goToNextLevel}
          onShare={handleShare}
        />
      )}
    </div>
  );
}