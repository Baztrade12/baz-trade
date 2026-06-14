import type { Metadata } from 'next';
import { DashboardProvider } from '@/components/providers/DashboardProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'BAZ Crypto Tech - Trading Dashboard',
  description: 'Institution-Grade Dashboard for Funding Rate Arbitrage Bot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
