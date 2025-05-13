"use client";

import { FrameContext } from "@farcaster/frame-core/dist/context";
import sdk from "@farcaster/frame-sdk";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import FrameWalletProvider from "./frame-wallet-provider";

interface FrameContextValue {
  context: FrameContext | null;
  isSDKLoaded: boolean;
  isEthProviderAvailable: boolean;
  error: string | null;
  actions: typeof sdk.actions | null;
}

const FrameProviderContext = createContext<FrameContextValue | undefined>(
  undefined
);

export function useFrame() {
  const context = useContext(FrameProviderContext);
  if (context === undefined) {
    throw new Error("useFrame must be used within a FrameProvider");
  }
  return context;
}

interface FrameProviderProps {
  children: ReactNode;
}

export function FrameProvider({ children }: FrameProviderProps) {
  const [context, setContext] = useState<FrameContext | null>(null);
  const [actions, setActions] = useState<typeof sdk.actions | null>(null);
  const [isEthProviderAvailable, setIsEthProviderAvailable] =
    useState<boolean>(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("Initializing Farcaster SDK...");

        // Immediately call ready to signal content is available
        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
          console.log("Calling SDK ready()...");
          await sdk.actions.ready();
        }

        // Get context
        const ctxResult = await sdk.context;
        if (ctxResult) {
          console.log("Farcaster context loaded");
          setContext(ctxResult as FrameContext);
          setActions(sdk.actions);
          setIsEthProviderAvailable(sdk.wallet.ethProvider ? true : false);
        } else {
          console.log("No Farcaster context available");
          setError("Failed to load Farcaster context");
        }
      } catch (err) {
        console.error("SDK initialization error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize SDK"
        );
      } finally {
        setIsSDKLoaded(true);
        
        // Second call to ready, to ensure content is visible
        // This helps in some edge cases
        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
          console.log("Calling SDK ready() again after load...");
          try {
            await sdk.actions.ready();
          } catch (e) {
            console.log("Error in second ready call:", e);
          }
        }
      }
    };

    // Load immediately
    if (!isSDKLoaded && typeof window !== 'undefined') {
      console.log("Starting SDK load process");
      load();
    }
  }, [isSDKLoaded]);

  return (
    <FrameProviderContext.Provider
      value={{
        context,
        actions,
        isSDKLoaded,
        isEthProviderAvailable,
        error,
      }}
    >
      <FrameWalletProvider>{children}</FrameWalletProvider>
    </FrameProviderContext.Provider>
  );
}