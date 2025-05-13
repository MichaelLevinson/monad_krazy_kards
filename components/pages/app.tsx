"use client";

import { SafeAreaContainer } from "@/components/safe-area-container";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

const KrazyKardsLanding = dynamic(() => import("@/components/pages/KrazyKardsLanding"), {
  ssr: false,
  loading: () => <div className="flex h-screen items-center justify-center">
    <div className="animate-pulse flex space-x-2">
      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
    </div>
  </div>,
});

export default function App() {
  // Get context, handling the case where it might be undefined
  const miniAppContext = useMiniAppContext();
  const context = miniAppContext?.context || null;
  
  // Call ready() when component mounts
  useEffect(() => {
    if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
      console.log("App component: calling ready()");
      sdk.actions.ready().catch(e => {
        console.log("Error calling ready from App component:", e);
      });
    } else {
      console.log("App component: sdk.actions.ready not available");
    }
  }, []);

  return (
    <SafeAreaContainer insets={context?.client?.safeAreaInsets}>
      <KrazyKardsLanding />
    </SafeAreaContainer>
  );
}