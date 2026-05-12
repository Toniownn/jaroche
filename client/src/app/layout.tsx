import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { NavbarGate } from '@/components/nav/NavbarGate';
import { FooterGate } from '@/components/nav/FooterGate';
import { AuthBootstrap } from '@/components/auth/AuthBootstrap';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Jaroché — Arts & Crafts Store',
  description: 'Handmade crochet from Yati, Liloan, Cebu. Made one stitch at a time by Kathlyn Jarocan.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${cormorant.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen flex flex-col antialiased">
        <AuthBootstrap />
        <NavbarGate />
        <main className="flex-1">{children}</main>
        <FooterGate />
        <Toaster theme="light" position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
