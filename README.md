# 🃏 Monad Krazy Kards 🃏

A fun, degen-style card matching game designed for the Farcaster ecosystem and Monad blockchain fans.

## Description

Monad Krazy Kards is a memory card game with social features:

- Match pairs of crypto-themed cards
- Find cards featuring your Farcaster friends
- Tip friends when you match their cards
- Share your scores on Farcaster
- Compete for high scores

## Features

- **No Backend Required**: Client-side only implementation
- **Farcaster Integration**: Authentication and social sharing
- **Optional Tipping**: Send MONAD tokens to friends
- **Leaderboards**: Local high score tracking
- **Mobile Friendly**: Works great on all devices

## Tech Stack

- **Next.js**: React framework for the frontend
- **Tailwind CSS**: For styling
- **Farcaster Frame SDK**: For Farcaster integration
- **LocalStorage**: For game state persistence
- **Viem/Wagmi**: For optional wallet interaction (tipping)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

This app can be deployed to any static hosting service:

1. Build the app with `npm run build`
2. Deploy the `.next` folder to your hosting provider

## Game Instructions

1. Click on cards to flip them
2. Find matching pairs to score points
3. Match cards faster for higher scores
4. The game ends when you find all pairs or time runs out
5. Share your score on Farcaster
6. Tip your friends when you match their cards

## Credits

Created by [Your Name] as a Farcaster mini-app for the Monad ecosystem.

---

Built with ❤️ for the degen community