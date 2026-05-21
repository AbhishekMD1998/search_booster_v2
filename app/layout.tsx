import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Search Booster — Is your product invisible to AI?',
  description: 'Audit any product page for AI search engine visibility. Score, diagnose, and rewrite with Gemini.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
