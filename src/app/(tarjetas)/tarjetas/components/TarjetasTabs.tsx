'use client';

import Link from 'next/link';
import {
  CreditCard,
  FileText,
  Building2,
} from 'lucide-react';

interface TarjetasTabsProps {
  currentStyles: any;
  activeTab: 'registrar' | 'tipos' | 'emitidas';
}

export function TarjetasTabs({ currentStyles, activeTab }: TarjetasTabsProps) {
  return (
    <div className={`${currentStyles.card} rounded-2xl p-2`}>
      <div className="flex gap-1 overflow-x-auto">
        <Link
          href="/tarjetas"
          className={`${
            activeTab === 'registrar' ? currentStyles.tabActive : currentStyles.tab
          } flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap rounded-xl flex-1 sm:flex-initial`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Registrar Tarjetas</span>
        </Link>
        <Link
          href="/tarjetas/screens/tipos"
          className={`${
            activeTab === 'tipos' ? currentStyles.tabActive : currentStyles.tab
          } flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap rounded-xl flex-1 sm:flex-initial`}
        >
          <FileText className="w-5 h-5" />
          <span>Tipos de Tarjetas</span>
        </Link>
        <Link
          href="/tarjetas/screens/emitidas"
          className={`${
            activeTab === 'emitidas' ? currentStyles.tabActive : currentStyles.tab
          } flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap rounded-xl flex-1 sm:flex-initial`}
        >
          <Building2 className="w-5 h-5" />
          <span>Tarjetas Emitidas</span>
        </Link>
      </div>
    </div>
  );
}