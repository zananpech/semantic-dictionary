import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Lexicon — Semantic Dictionary',
  description:
    'Find the perfect word. Search by meaning or keyword to discover words you didn\'t know you needed.',
  keywords: ['dictionary', 'semantic search', 'vocabulary', 'word finder'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)' }}>
        {children}
      </body>
    </html>
  );
}
