"use client";

import { useState } from 'react';
import { useMiniAppContext } from '@/hooks/use-miniapp-context';

export function Debug() {
  const miniAppContext = useMiniAppContext();
  const [expanded, setExpanded] = useState(false);
  
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_DEVELOPMENT) {
    return null;
  }
  
  return (
    <div className="fixed bottom-24 right-4 z-50">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg"
      >
        🐞
      </button>
      
      {expanded && (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mt-2 max-w-lg max-h-96 overflow-auto">
          <h3 className="font-bold mb-2">Debug Info</h3>
          <div className="text-xs font-mono whitespace-pre">
            <p>Context available: {miniAppContext.context ? 'Yes' : 'No'}</p>
            <p>Actions available: {miniAppContext.actions ? 'Yes' : 'No'}</p>
            <p>ETH Provider: {miniAppContext.isEthProviderAvailable ? 'Yes' : 'No'}</p>
            <p>App URL: {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</p>
            <p>Environment: {process.env.NODE_ENV}</p>
            <hr className="my-2" />
            <p className="font-bold">Context Data:</p>
            <pre>{JSON.stringify(miniAppContext.context, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}