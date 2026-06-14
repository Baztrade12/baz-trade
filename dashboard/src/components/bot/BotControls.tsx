'use client';

import { useDashboardStore } from '../../store/dashboard.store';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Power } from 'lucide-react';
import { useState } from 'react';

export function BotControls() {
  const botStatus = useDashboardStore((state) => state.botStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { emit } = useWebSocket();

  const handleToggleBot = async () => {
    setIsLoading(true);
    try {
      if (botStatus?.isRunning) {
        emit('bot:stop');
      } else {
        emit('bot:start');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Bot Status</h3>
        <div className="flex items-center gap-2 mt-2">
          <div
            className={`w-3 h-3 rounded-full ${
              botStatus?.isRunning ? 'bg-success animate-pulse' : 'bg-gray-500'
            }`}
          />
          <p className="text-sm text-gray-400">
            {botStatus?.isRunning ? 'Running' : 'Stopped'}
          </p>
        </div>
      </div>
      <button
        onClick={handleToggleBot}
        disabled={isLoading}
        className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
          botStatus?.isRunning
            ? 'bg-danger/20 text-danger hover:bg-danger/30'
            : 'bg-success/20 text-success hover:bg-success/30'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Power className="w-4 h-4" />
        {botStatus?.isRunning ? 'Stop Bot' : 'Start Bot'}
      </button>
    </div>
  );
}
