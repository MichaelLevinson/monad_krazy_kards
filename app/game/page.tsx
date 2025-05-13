"use client";

import { SafeAreaContainer } from "@/components/safe-area-container";
import KrazyKards from "@/components/game/KrazyKards";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

export default function GamePage() {
  const miniAppContext = useMiniAppContext();
  const context = miniAppContext?.context || null;
  
  // Call ready() when component mounts
  useEffect(() => {
    if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
      console.log("GamePage: calling ready()");
      sdk.actions.ready().catch(e => {
        console.log("Error calling ready from GamePage:", e);
      });
    } else {
      console.log("GamePage: sdk.actions.ready not available");
    }
  }, []);

  return (
    <SafeAreaContainer insets={context?.client?.safeAreaInsets}>
      <KrazyKards />
    </SafeAreaContainer>
  );
}