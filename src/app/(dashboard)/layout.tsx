'use client';

import { Sidebar } from '@/src/components/layout/Sidebar';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  const styles = {
    light: {
      background: 'bg-neutral-50',
    },
    dark: {
      background: 'bg-black',
    },
  };

  const currentStyles = styles[theme];

  return (
    <div className={`${currentStyles.background} min-h-screen transition-colors duration-300`}>
      <Sidebar />
      {/* Mobile: padding top + horizontal, Desktop: margin left + padding */}
      <div className="lg:ml-64 pt-20 lg:pt-0">
        <main className="p-6 lg:p-12 lg:pl-16">
          {children}
        </main>
      </div>
    </div>
  );
}