'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/src/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const styles = {
    light: {
      button: 'w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center',
      icon: 'w-5 h-5 text-black hover:scale-110 transition-transform'
    },
    dark: {
      button: 'w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm hover:shadow-md transition-all flex items-center justify-center',
      icon: 'w-5 h-5 text-white hover:scale-110 transition-transform'
    }
  };

  const currentStyles = styles[theme];

  return (
    <button
      onClick={toggleTheme}
      className={currentStyles.button}
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? (
        <Sun className={currentStyles.icon} />
      ) : (
        <Moon className={currentStyles.icon} />
      )}
    </button>
  );
}