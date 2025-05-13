"use client";

interface GameControlsProps {
  onRestart: () => void;
  gameOver: boolean;
}

export default function GameControls({ onRestart, gameOver }: GameControlsProps) {
  return (
    <div className="mt-4 w-full flex justify-center">
      <button
        onClick={onRestart}
        className={`px-4 py-2 rounded-lg font-bold shadow-lg transition-all
                   ${gameOver 
                     ? 'bg-purple-600 text-white animate-pulse transform hover:scale-105' 
                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        {gameOver ? '🔄 Play Again' : '↻ Restart'}
      </button>
    </div>
  );
}