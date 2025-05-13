"use client";

import { useFrame } from "../components/farcaster-provider";
import { FrameContext } from "@farcaster/frame-core/dist/context";
import sdk from "@farcaster/frame-sdk";
import { useState, useEffect } from "react";

// Define specific types for each context
interface FarcasterContextResult {
  context: FrameContext;
  actions: typeof sdk.actions | null;
  isEthProviderAvailable: boolean;
}

interface NoContextResult {
  type: null;
  context: null;
  actions: null;
  isEthProviderAvailable: boolean;
}

// Union type of all possible results
type ContextResult = FarcasterContextResult | NoContextResult;

function useMiniAppContext(): ContextResult {
  const [isDebugMode, setIsDebugMode] = useState(false);
  
  useEffect(() => {
    // Check for debug mode on load
    const isDevEnv = process.env.NODE_ENV === 'development' || 
                    process.env.NEXT_PUBLIC_DEVELOPMENT === 'true';
    const hasDebugParam = typeof window !== 'undefined' && 
                          window.location.search.includes('debug=true');
    
    setIsDebugMode(isDevEnv || hasDebugParam);
    
    // Log debug info
    if (isDevEnv || hasDebugParam) {
      console.log('Debug mode enabled');
      console.log('Environment:', process.env.NODE_ENV);
      console.log('URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');
      console.log('Farcaster SDK in window:', typeof window !== 'undefined' && !!(window as any).farcaster);
    }
  }, []);
  
  // Try to get Farcaster context
  try {
    const farcasterContext = useFrame();
    
    // Debug log the context
    if (isDebugMode && typeof window !== 'undefined') {
      console.log('Farcaster context:', farcasterContext);
    }
    
    if (farcasterContext.context) {
      return {
        context: farcasterContext.context,
        actions: farcasterContext.actions,
        isEthProviderAvailable: farcasterContext.isEthProviderAvailable,
      } as FarcasterContextResult;
    }
  } catch (e) {
    // In debug mode, log the error
    if (isDebugMode) {
      console.log('Error getting Farcaster context:', e);
    }
    // Ignore error if not in Farcaster context
  }

  // Mock context for development if needed
  if (isDebugMode && process.env.NODE_ENV === 'development') {
    console.log('Providing mock context for development');
    // You could return a mock context here for easier development
  }

  // No context found
  return {
    context: null,
    actions: null,
    isEthProviderAvailable: false,
    type: null
  } as NoContextResult;
}

export { useMiniAppContext };