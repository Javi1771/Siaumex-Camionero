// src/app/%28auth%29/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | SIAUMEX Camionero',
  description: 'Inicia sesión en SIAUMEX Camionero',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}