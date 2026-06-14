'use client';

import { ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface ProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: ProviderProps) {
  useWebSocket();

  return <>{children}</>;
}
