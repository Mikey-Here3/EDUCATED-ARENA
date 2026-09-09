import type { Metadata, Viewport } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://educatedgamerarena.com'),
  title: {
    default: 'Educated Gamer Arena - Premier Competitive Free Fire Platform',
    template: '%s | Educated Gamer Arena',
  },
  description:
    'Pakistan\'s premier competitive Free Fire platform. Real-time stakes, 1v1 to 6v6 challenges, verified room lobbies, and instant prize payouts.',
  keywords: [
    'Free Fire',
    'esports',
    'competitive gaming',
    'Pakistan',
    'Educated Gamer',
    'Free Fire Arena',
    'Custom Room',
  ],
  authors: [{ name: 'Educated Gamer' }],
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: 'Educated Gamer Arena',
    title: 'Educated Gamer Arena - Competitive Free Fire Platform',
    description:
      'Pakistan\'s premier competitive Free Fire platform. Compete in challenges, guild wars, and prove yourself in the arena.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Educated Gamer Arena',
    description:
      'Pakistan\'s premier competitive Free Fire platform.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#030014',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#030014] text-white font-sans antialiased overflow-x-hidden selection:bg-[#DC2626] selection:text-white">
        {/* Ambient Cyber Grid & 3D Texture Layers */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Top subtle red/purple radial light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#DC2626]/12 via-[#8B5CF6]/8 to-transparent rounded-full blur-[140px]" />
          {/* Scanline CRT overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.015)_1px,_transparent_1px)] bg-[size:100%_4px] opacity-70" />
          {/* Subtle 3D cyber grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
