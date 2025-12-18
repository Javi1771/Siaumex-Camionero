'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/src/components/ui/theme-toggle';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useToastHelpers } from '@/src/components/ui/toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const { theme } = useTheme();
  const toast = useToastHelpers();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('¡Inicio de sesión exitoso!');
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 500);
      } else {
        toast.error(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      toast.error('Error de conexión. Intente nuevamente.');
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos específicos para este componente
  const styles = {
    light: {
      container: 'min-h-screen bg-white flex items-center justify-center p-6 relative',
      card: 'bg-white rounded-[32px] p-10 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_8px_32px_rgba(0,0,0,0.04)]',
      logo: 'w-20 h-20 bg-black rounded-[20px] mx-auto mb-6 flex items-center justify-center',
      logoIcon: 'w-10 h-10 text-white',
      title: 'text-3xl font-semibold text-black mb-2',
      subtitle: 'text-sm text-neutral-500',
      label: 'text-sm font-medium text-neutral-700 block pl-1',
      input: 'w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all',
      inputPassword: 'w-full px-4 py-4 pr-12 bg-neutral-50 border border-neutral-200 rounded-2xl text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all',
      eyeButton: 'absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors',
      submitButton: 'w-full mt-8 py-4 bg-black text-white rounded-2xl font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
      footer: 'text-xs text-neutral-400'
    },
    dark: {
      container: 'min-h-screen bg-black flex items-center justify-center p-6 relative',
      card: 'bg-neutral-900 rounded-[32px] p-10 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.4)]',
      logo: 'w-20 h-20 bg-white rounded-[20px] mx-auto mb-6 flex items-center justify-center',
      logoIcon: 'w-10 h-10 text-black',
      title: 'text-3xl font-semibold text-white mb-2',
      subtitle: 'text-sm text-neutral-400',
      label: 'text-sm font-medium text-neutral-300 block pl-1',
      input: 'w-full px-4 py-4 bg-neutral-800 border border-neutral-700 rounded-2xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all',
      inputPassword: 'w-full px-4 py-4 pr-12 bg-neutral-800 border border-neutral-700 rounded-2xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all',
      eyeButton: 'absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors',
      submitButton: 'w-full mt-8 py-4 bg-white text-black rounded-2xl font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
      footer: 'text-xs text-neutral-600'
    }
  };

  const currentStyles = styles[theme];

  return (
    <div className={currentStyles.container}>
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[400px]">
        <div className={currentStyles.card}>
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className={currentStyles.logo}>
              <svg
                className={currentStyles.logoIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className={currentStyles.title}>
              Bienvenido
            </h1>
            <p className={currentStyles.subtitle}>
              Inicia sesión en SIAUMEX
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-2">
              <label htmlFor="username" className={currentStyles.label}>
                Usuario o Email
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className={currentStyles.input}
                placeholder="usuario@ejemplo.com"
                required
                autoComplete="username"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className={currentStyles.label}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={currentStyles.inputPassword}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={currentStyles.eyeButton}
                  tabIndex={-1}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={currentStyles.submitButton}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className={currentStyles.footer}>
              SIAUMEX © 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}