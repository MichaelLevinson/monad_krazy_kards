# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monad Moments is a social application that transforms blockchain activity on Monad into shareable social experiences. The app captures notable on-chain interactions and presents them as visually appealing "Moments" that users can share with the Farcaster community.

## Phase 1 Features

The current implementation focuses on these core features:
- Basic user authentication with Farcaster
- Moment creation from blockchain activity
- Social feed showing moments from friends
- Ability to share moments to Farcaster
- Simple user profile/dashboard

Future phases (tipping, gamification, quests) should NOT be implemented yet.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

## Architecture

The application follows a modern React-based architecture:

1. **Frontend**: Next.js application with React components and Tailwind CSS
   - `/app` - Next.js app router pages and layouts
   - `/components` - React components organized by purpose
   - `/hooks` - Custom React hooks for authentication and state management

2. **Backend**: Next.js API routes
   - Currently using mock data
   - Will eventually connect to database
   - Will eventually monitor blockchain activity

3. **Farcaster Integration**:
   - Authentication via Farcaster Auth
   - Frame Wallet integration for connecting crypto wallets
   - Social sharing functionality

## Component Structure

- `farcaster-provider.tsx` - Provides Farcaster context to the application
- `frame-wallet-provider.tsx` - Wallet provider for Farcaster frames
- `MonadMoments.tsx` - Main application component with tabs for Dashboard and Feed
- `Dashboard.tsx` - User profile and recent moments
- `MomentsFeed.tsx` - Feed showing moments from friends or everyone
- `MomentCard.tsx` - Individual moment display with sharing functionality

## Key Hooks

- `use-miniapp-context.ts` - Hook for accessing Farcaster context
- `useAccount`, `useConnect` - Wagmi hooks for wallet connection

## Mock Data Structure

For Phase 1, we're using mock data to simulate:
- User authentication with Farcaster
- User moments and friend moments
- Wallet connection

## Future Implementation

When building out the backend, we'll need to implement:
1. Real database connections
2. Blockchain monitoring using viem
3. Real Farcaster authentication
4. Transaction verification
5. API endpoints for moments and user data