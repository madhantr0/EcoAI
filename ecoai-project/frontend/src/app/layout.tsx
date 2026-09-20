import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoAI — Luxury Environmental Intelligence',
  description: 'Verify, adopt, and chain your tree plantings with satellite intelligence.',
  themeColor: '#0B120B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-obsidian-gradient text-pearl antialiased">{children}</body>
    </html>
  );
}
