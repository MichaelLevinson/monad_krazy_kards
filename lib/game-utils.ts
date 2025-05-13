// Define card types and values
const monadSymbols = [
  { value: 'MONAD', imageUrl: '💎' },
  { value: 'ETH', imageUrl: '🔷' },
  { value: '10x', imageUrl: '🚀' },
  { value: 'HODL', imageUrl: '💪' },
  { value: 'APE', imageUrl: '🦍' },
  { value: 'MOON', imageUrl: '🌕' },
  { value: 'GAS', imageUrl: '⛽' },
  { value: 'DEGEN', imageUrl: '🎲' },
  { value: 'WHALE', imageUrl: '🐋' },
  { value: 'PUMP', imageUrl: '📈' },
  { value: 'DUMP', imageUrl: '📉' },
  { value: 'NGMI', imageUrl: '😭' },
  { value: 'WAGMI', imageUrl: '👨‍👩‍👧‍👦' },
  { value: 'FUD', imageUrl: '😱' },
  { value: 'FOMO', imageUrl: '🏃' },
  { value: 'SAFU', imageUrl: '🔒' },
  { value: 'REKT', imageUrl: '💥' },
  { value: 'ALPHA', imageUrl: '🔍' },
  { value: 'BTFD', imageUrl: '👇' },
  { value: 'MEWN', imageUrl: '🌑' },
  { value: 'ANON', imageUrl: '🕵️' },
  { value: 'POAP', imageUrl: '🏆' },
  { value: 'BASED', imageUrl: '🔥' },
  { value: 'CHAD', imageUrl: '💪' },
];

/**
 * Generate pairs of matching cards
 */
export function generateCards(numPairs: number, friends: any[] = []) {
  const cards = [];
  const symbols = [...monadSymbols];
  
  // Shuffle the symbols
  shuffleArray(symbols);
  
  // Add friend cards if available (with duplicates for matching)
  const friendCards = [];
  if (friends.length > 0) {
    // Use up to 3 friends or more depending on the level
    const numFriends = Math.min(friends.length, Math.ceil(numPairs / 4));
    for (let i = 0; i < numFriends; i++) {
      const friend = friends[i];
      const cardValue = friend.displayName || friend.username;
      
      friendCards.push({
        id: `friend-${i}-1`,
        type: 'friend',
        value: cardValue,
        imageUrl: friend.pfpUrl || 'https://cdn.stamp.fyi/avatar/eth:0x0000000000000000000000000000000000000000?s=300',
      });
      
      friendCards.push({
        id: `friend-${i}-2`,
        type: 'friend',
        value: cardValue,
        imageUrl: friend.pfpUrl || 'https://cdn.stamp.fyi/avatar/eth:0x0000000000000000000000000000000000000000?s=300',
      });
    }
  }
  
  // Add Monad symbol cards
  const symbolsToUse = numPairs - (friendCards.length / 2);
  for (let i = 0; i < symbolsToUse; i++) {
    const symbol = symbols[i % symbols.length];
    
    cards.push({
      id: `symbol-${i}-1`,
      type: 'monad',
      value: symbol.value,
      imageUrl: symbol.imageUrl,
    });
    
    cards.push({
      id: `symbol-${i}-2`,
      type: 'monad',
      value: symbol.value,
      imageUrl: symbol.imageUrl,
    });
  }
  
  // Combine and return all cards
  return shuffleCards([...cards, ...friendCards]);
}

/**
 * Shuffle an array in place
 */
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Shuffle cards and return a new array
 */
export function shuffleCards(cards: any[]) {
  return [...shuffleArray([...cards])];
}

/**
 * Check if two cards match
 */
export function checkForMatch(card1: any, card2: any) {
  return card1.value === card2.value;
}

/**
 * Get level configuration
 */
export function getLevelConfig(level: number) {
  // Level 1: 8 pairs (16 cards) with 60 seconds
  // Each level after that:
  // - Add 2 more pairs
  // - Reduce time by 25% of previous time
  
  // Base values
  const basePairs = 8;
  const baseTime = 60;
  
  // Calculate number of pairs - capped at 18 pairs (36 cards)
  const pairs = Math.min(basePairs + (level - 1) * 2, 18);
  
  // Calculate time decrease factor
  // Level 1: 60 seconds
  // Level 2: 45 seconds (60 - 15)
  // Level 3: ~34 seconds (45 - 11.25)
  // etc.
  let time = baseTime;
  for (let i = 1; i < level; i++) {
    time = time - (time * 0.25);
  }
  
  // Ensure minimum time is 15 seconds
  time = Math.max(Math.round(time), 15);
  
  return {
    level,
    pairs,
    time,
    gridSize: pairs <= 8 ? 4 : pairs <= 12 ? 5 : 6,
    // Bonus multiplier increases with level
    scoreMultiplier: 1 + (level - 1) * 0.5,
  };
}

/**
 * Generate a mock list of friends for testing
 */
export function getMockFriends() {
  return [
    {
      fid: 1,
      username: 'krazyfren',
      displayName: 'Krazy Fren',
      pfpUrl: 'https://cdn.stamp.fyi/avatar/eth:0x1234567890123456789012345678901234567890?s=300'
    },
    {
      fid: 2,
      username: 'monadmaxi',
      displayName: 'Monad Maxi',
      pfpUrl: 'https://cdn.stamp.fyi/avatar/eth:0x2345678901234567890123456789012345678901?s=300'
    },
    {
      fid: 3,
      username: 'degendev',
      displayName: 'Degen Dev',
      pfpUrl: 'https://cdn.stamp.fyi/avatar/eth:0x3456789012345678901234567890123456789012?s=300'
    },
    {
      fid: 4,
      username: 'cryptoqueen',
      displayName: 'Crypto Queen',
      pfpUrl: 'https://cdn.stamp.fyi/avatar/eth:0x4567890123456789012345678901234567890123?s=300'
    }
  ];
}