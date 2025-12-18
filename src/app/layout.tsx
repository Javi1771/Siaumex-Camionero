import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { ToastProvider } from '@/src/components/ui/toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SIAUMEX Camionero',
  description: 'Sistema de gestión para camioneros',
  icons: {
    icon: [
      {
        url: '/siaumex.png',
        href: '/siaumex.png',
      },
    ],
    apple: [
      {
        url: '/siaumex.png',
        href: '/siaumex.png',
      },
    ],
    shortcut: ['/siaumex.png'],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/siaumex.png" type="image/png" />
        <link rel="apple-touch-icon" href="/siaumex.png" />
        <link rel="shortcut icon" href="/siaumex.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}