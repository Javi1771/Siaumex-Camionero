'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/src/contexts/ThemeContext';
import Image from "next/image";
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Truck, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/src/components/ui/theme-toggle';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  enabled: boolean;
}

const navigation: NavItem[] = [
  {
    name: 'Panel',
    href: '/dashboard',
    icon: LayoutDashboard,
    enabled: true,
  },
  {
    name: 'Tarjetas',
    href: '/tarjetas',
    icon: CreditCard,
    enabled: true,
  },
  {
    name: 'Clientes',
    href: '/clientes',
    icon: Users,
    enabled: false,
  },
  {
    name: 'Unidades',
    href: '/unidades',
    icon: Truck,
    enabled: false,
  },
  {
    name: 'Herramientas',
    href: '/herramientas',
    icon: Settings,
    enabled: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const styles = {
    light: {
      sidebar: 'bg-white border-r border-neutral-200',
      mobileSidebar: 'bg-white',
      header: 'border-b border-neutral-200',
      logoBg: 'bg-white',
      title: 'text-black',
      subtitle: 'text-neutral-500',
      navItemActive: 'bg-black text-white',
      navItemInactive: 'text-neutral-600 hover:bg-neutral-100',
      navItemDisabled: 'text-neutral-300 cursor-not-allowed',
      logoutButton: 'text-red-800 hover:bg-red-800/20',
      divider: 'border-neutral-200',
      mobileMenuButton: 'bg-white border border-neutral-200 text-black',
      backdrop: 'bg-black/20',
    },
    dark: {
      sidebar: 'bg-neutral-950 border-r border-neutral-800',
      mobileSidebar: 'bg-neutral-950',
      header: 'border-b border-neutral-800',
      logoBg: 'bg-white',
      title: 'text-white',
      subtitle: 'text-neutral-400',
      navItemActive: 'bg-white text-black',
      navItemInactive: 'text-neutral-400 hover:bg-neutral-900',
      navItemDisabled: 'text-neutral-700 cursor-not-allowed',
      logoutButton: 'text-red-500 hover:bg-red-800/20',
      divider: 'border-neutral-800',
      mobileMenuButton: 'bg-neutral-900 border border-neutral-800 text-white',
      backdrop: 'bg-black/60',
    },
  };

  const currentStyles = styles[theme];

  return (
    <>
      {/* Mobile Menu Button - Fixed top */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`${currentStyles.mobileMenuButton} p-3 rounded-2xl shadow-lg transition-all`}
        >
          <Menu className="w-6 h-6" />
        </button>
        <ThemeToggle />
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className={`lg:hidden fixed inset-0 ${currentStyles.backdrop} z-50 backdrop-blur-sm`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-80 ${currentStyles.mobileSidebar} z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className={`${currentStyles.header} p-6 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`${currentStyles.logoBg} w-12 h-12 rounded-2xl flex items-center justify-center p-2 transition-colors duration-300`}>
                <Image
                  src="/siaumex.png"
                  alt="SIAUMEX"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  priority
                />              
              </div>
              <div>
                <h1 className={`${currentStyles.title} font-bold text-lg transition-colors duration-300`}>SIAUMEX</h1>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${currentStyles.navItemInactive} p-2 rounded-xl`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              if (!item.enabled) {
                return (
                  <div
                    key={item.name}
                    className={`${currentStyles.navItemDisabled} flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                    <span className="ml-auto text-xs bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                      Pronto
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${
                    isActive ? currentStyles.navItemActive : currentStyles.navItemInactive
                  } flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Footer */}
          <div className={`p-4 space-y-2 border-t ${currentStyles.divider}`}>
            <button
              onClick={handleLogout}
              className={`${currentStyles.logoutButton} w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block fixed left-0 top-0 h-full w-64 ${currentStyles.sidebar} z-40 transition-all duration-300`}>
        <div className="flex flex-col h-full">
          {/* Desktop Header */}
          <div className={`${currentStyles.header} p-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`${currentStyles.logoBg} w-10 h-10 rounded-xl flex items-center justify-center p-1.5 transition-colors duration-300`}>
                <Image
                  src="/siaumex.png"
                  alt="SIAUMEX"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className={`${currentStyles.title} font-semibold text-sm transition-colors duration-300`}>SIAUMEX</h1>
              </div>
            </div>
            {/* Theme Toggle en Desktop */}
            <ThemeToggle />
          </div>

          {/* Desktop Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              if (!item.enabled) {
                return (
                  <div
                    key={item.name}
                    className={`${currentStyles.navItemDisabled} flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                    <span className="ml-auto text-xs bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                      Pronto
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive ? currentStyles.navItemActive : currentStyles.navItemInactive
                  } flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Footer */}
          <div className={`p-3 space-y-2 border-t ${currentStyles.divider}`}>
            <button
              onClick={handleLogout}
              className={`${currentStyles.logoutButton} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}