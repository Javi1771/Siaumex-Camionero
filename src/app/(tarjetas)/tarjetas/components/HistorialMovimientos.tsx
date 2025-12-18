'use client';

import { 
  Building2,
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity,
  Filter,
  RotateCcw
} from 'lucide-react';
import type { HistorialMovimientos as HistorialType } from '@/src/types/tarjetas';

interface HistorialMovimientosProps {
  theme: 'light' | 'dark';
  currentStyles: any;
  clienteId: string;
  historial: HistorialType | null;
  filtroFechaDesde: string;
  filtroFechaHasta: string;
  setFiltroFechaDesde: (fecha: string) => void;
  setFiltroFechaHasta: (fecha: string) => void;
  limpiarFiltros: () => void;
}

export function HistorialMovimientos({
  theme,
  currentStyles,
  clienteId,
  historial,
  filtroFechaDesde,
  filtroFechaHasta,
  setFiltroFechaDesde,
  setFiltroFechaHasta,
  limpiarFiltros,
}: HistorialMovimientosProps) {
  return (
    <div className={`${currentStyles.card} rounded-2xl p-6 sticky top-6`}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <h2 className={`${currentStyles.header} text-lg font-bold`}>
          Historial de Movimientos
        </h2>
      </div>

      {clienteId && historial ? (
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className={`${currentStyles.statCard} rounded-xl p-5 shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">
                Saldo Actual
              </p>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-3xl font-black text-green-800 dark:text-green-200 mb-1">
              {historial.saldoActual.toFixed(2)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
              KG disponibles
            </p>
          </div>

          <div className={`${currentStyles.statCardBlue} rounded-xl p-5 shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                Importe Total
              </p>
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-3xl font-black text-blue-800 dark:text-blue-200 mb-1">
              ${historial.importeTotal.toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              Valor monetario
            </p>
          </div>

          <div className={`${currentStyles.statCardPurple} rounded-xl p-5 shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                Movimientos
              </p>
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-3xl font-black text-purple-800 dark:text-purple-200 mb-1">
              {historial.totalMovimientos}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
              Operaciones totales
            </p>
          </div>

          {/* Filtros */}
          <div className={`${currentStyles.sectionBg} rounded-xl p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <span className={`${currentStyles.label} text-xs font-bold uppercase tracking-wide`}>
                  Filtros
                </span>
              </div>
              {(filtroFechaDesde || filtroFechaHasta) && (
                <button
                  onClick={limpiarFiltros}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpiar
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Desde
                </label>
                <input
                  type="date"
                  value={filtroFechaDesde}
                  onChange={(e) => setFiltroFechaDesde(e.target.value)}
                  className={`${currentStyles.input} w-full px-2 py-2 text-xs`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Hasta
                </label>
                <input
                  type="date"
                  value={filtroFechaHasta}
                  onChange={(e) => setFiltroFechaHasta(e.target.value)}
                  className={`${currentStyles.input} w-full px-2 py-2 text-xs`}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block p-6 bg-neutral-100 dark:bg-neutral-800 rounded-3xl mb-4">
            <CreditCard className="w-16 h-16 text-neutral-300 dark:text-neutral-600" />
          </div>
          <h3 className={`${currentStyles.header} text-lg font-bold mb-2`}>
            Sin Cliente Seleccionado
          </h3>
          <p className={`${currentStyles.subtitle} text-sm max-w-xs mx-auto`}>
            Selecciona un cliente en el formulario para ver su historial de movimientos
          </p>
        </div>
      )}
    </div>
  );
}