import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CardHaven — Pokémon TCG Store & Pack Opening Simulator',
  description: 'Premium hobby shop simulation, sealed product purchasing, cinematic pack tearing, and master binder collection.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`dark h-full antialiased ${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-full flex flex-col bg-[#090b0e] text-zinc-100">{children}</body>
    </html>
  );
}
