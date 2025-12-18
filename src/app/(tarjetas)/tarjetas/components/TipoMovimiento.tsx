'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Activity, 
  DollarSign, 
  Receipt,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import type { TarjetaDisponible } from '@/src/types/tarjetas';

interface TipoMovimientoProps {
  theme: 'light' | 'dark';
  currentStyles: any;
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export function TipoMovimiento({
  theme,
  currentStyles,
  formData,
  setFormData,
  currentStep,
  setCurrentStep,
}: TipoMovimientoProps) {
  const [tarjetasDisponibles, setTarjetasDisponibles] = useState<TarjetaDisponible[]>([]);
  const [isLoadingTarjetas, setIsLoadingTarjetas] = useState(false);

  useEffect(() => {
    if (formData.tipoMovimiento === 'extraer' && formData.clienteId) {
      fetchTarjetasDisponibles();
    }
  }, [formData.tipoMovimiento, formData.clienteId]);

  const fetchTarjetasDisponibles = async () => {
    setIsLoadingTarjetas(true);
    try {
      const response = await fetch(`/api/tarjetas/disponibles?clienteId=${encodeURIComponent(formData.clienteId)}`);
      const data = await response.json();
      if (data.success) {
        setTarjetasDisponibles(data.data);
      }
    } catch (error) {
      console.error('Error al cargar tarjetas disponibles:', error);
    } finally {
      setIsLoadingTarjetas(false);
    }
  };

  const handleTarjetaSelect = (tarjeta: TarjetaDisponible) => {
    setFormData((prev: any) => ({
      ...prev,
      tarjetaSeleccionadaId: tarjeta.Id,
      precioKG: tarjeta.PrecioKG,
      saldoDisponible: tarjeta.SaldoActual,
    }));
  };

  return (
    <div className={`${currentStyles.card} rounded-2xl p-8 space-y-6 ${currentStyles.cardHover} transition-all`}>
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="p-2.5 bg-purple-100 dark:bg-purple-950 rounded-xl">
          <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className={`${currentStyles.header} text-xl font-bold`}>
            Tipo de Movimiento
          </h3>
          <p className={`${currentStyles.subtitle} text-sm`}>
            Define el tipo de operación y los montos
          </p>
        </div>
      </div>

      {/* Selector de Tipo de Movimiento */}
      <div className="space-y-3">
        <label className={`${currentStyles.label} text-sm flex items-center gap-2`}>
          <Activity className="w-4 h-4" />
          Tipo de Operación *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData((prev: any) => ({ ...prev, tipoMovimiento: 'nueva', tarjetaSeleccionadaId: undefined }))}
            className={`p-6 rounded-2xl transition-all text-left ${
              formData.tipoMovimiento === 'nueva'
                ? currentStyles.movimientoActive
                : currentStyles.movimientoInactive
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Plus className="w-6 h-6" />
              <span className="font-bold text-lg">Nueva Tarjeta</span>
            </div>
            <p className={`text-sm ${
              formData.tipoMovimiento === 'nueva'
                ? currentStyles.movimientoActiveSubtext
                : currentStyles.movimientoInactiveSubtext
            }`}>
              Registrar una nueva tarjeta con saldo inicial
            </p>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData((prev: any) => ({ ...prev, tipoMovimiento: 'extraer' }))}
            className={`p-6 rounded-2xl transition-all text-left ${
              formData.tipoMovimiento === 'extraer'
                ? currentStyles.movimientoActive
                : currentStyles.movimientoInactive
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6" />
              <span className="font-bold text-lg">Extraer Saldo</span>
            </div>
            <p className={`text-sm ${
              formData.tipoMovimiento === 'extraer'
                ? currentStyles.movimientoActiveSubtext
                : currentStyles.movimientoInactiveSubtext
            }`}>
              Retirar saldo de una tarjeta existente
            </p>
          </button>
        </div>
      </div>

      {/* Tarjetas Disponibles (solo para extraer) */}
      {formData.tipoMovimiento === 'extraer' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className={`${currentStyles.label} text-sm flex items-center gap-2`}>
              <Receipt className="w-4 h-4" />
              Tarjetas Disponibles
            </label>
            <button
              type="button"
              onClick={fetchTarjetasDisponibles}
              disabled={isLoadingTarjetas}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingTarjetas ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

            {isLoadingTarjetas ? (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            </div>
            ) : tarjetasDisponibles.length > 0 ? (
            <div className="space-y-2">
                {tarjetasDisponibles.map((tarjeta) => {
                const isSelected = formData.tarjetaSeleccionadaId === tarjeta.Id;
                return (
                    <button
                    key={tarjeta.Id}
                    type="button"
                    onClick={() => handleTarjetaSelect(tarjeta)}
                    className={`w-full text-left rounded-2xl p-5 border-2 transition-all ${
                        isSelected
                        ? 'border-white dark:border-white bg-white dark:bg-white shadow-2xl scale-[1.02]'
                        : 'border-neutral-800 dark:border-neutral-800 bg-neutral-900/50 dark:bg-neutral-900/50 hover:border-neutral-700 dark:hover:border-neutral-700 hover:shadow-md hover:bg-neutral-900 dark:hover:bg-neutral-900'
                    }`}
                    >
                    <div className="flex items-start justify-between gap-4">
                        {/* Info principal */}
                        <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            isSelected
                                ? 'bg-black dark:bg-black text-white dark:text-white'
                                : 'bg-neutral-800 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-400'
                            }`}>
                            ID: {tarjeta.Id}
                            </div>
                            <span className={`text-sm font-semibold truncate ${
                            isSelected
                                ? 'text-black dark:text-black'
                                : 'text-neutral-300 dark:text-neutral-300'
                            }`}>
                            {tarjeta.TipoTarjeta}
                            </span>
                        </div>

                        {/* Grid de datos */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                            <p className={`text-xs font-medium mb-1 ${
                                isSelected
                                ? 'text-neutral-600 dark:text-neutral-600'
                                : 'text-neutral-500 dark:text-neutral-500'
                            }`}>
                                Precio por KG
                            </p>
                            <p className={`text-base font-bold ${
                                isSelected
                                ? 'text-black dark:text-black'
                                : 'text-neutral-300 dark:text-neutral-300'
                            }`}>
                                ${tarjeta.PrecioKG.toFixed(2)}
                            </p>
                            </div>

                            <div>
                            <p className={`text-xs font-medium mb-1 ${
                                isSelected
                                ? 'text-neutral-600 dark:text-neutral-600'
                                : 'text-neutral-500 dark:text-neutral-500'
                            }`}>
                                Saldo Actual
                            </p>
                            <p className={`text-base font-bold ${
                                isSelected
                                ? 'text-black dark:text-black'
                                : 'text-neutral-300 dark:text-neutral-300'
                            }`}>
                                {tarjeta.SaldoActual.toFixed(2)} KG
                            </p>
                            </div>
                        </div>

                        {/* Máximo equivalente */}
                        <div className={`mt-3 pt-3 border-t ${
                            isSelected
                            ? 'border-neutral-200 dark:border-neutral-400'
                            : 'border-neutral-800 dark:border-neutral-800'
                        }`}>
                            <p className={`text-xs font-medium mb-1 ${
                            isSelected
                                ? 'text-neutral-600 dark:text-neutral-600'
                                : 'text-neutral-500 dark:text-neutral-500'
                            }`}>
                            Máximo Equivalente
                            </p>
                            <p className={`text-lg font-bold ${
                            isSelected
                                ? 'text-black dark:text-black'
                                : 'text-neutral-300 dark:text-neutral-300'
                            }`}>
                            ${tarjeta.MaximoEquivalente.toFixed(2)}
                            </p>
                        </div>
                        </div>

                        {/* Icono de selección */}
                        <div className={`flex-shrink-0 transition-all ${
                        isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        }`}>
                        <div className={`p-2 rounded-full ${
                            isSelected
                            ? 'bg-black dark:bg-black'
                            : ''
                        }`}>
                            <CheckCircle2 className={`w-6 h-6 ${
                            isSelected
                                ? 'text-white dark:text-white'
                                : ''
                            }`} />
                        </div>
                        </div>
                    </div>
                    </button>
                );
                })}
            </div>
            ) : (
            <div className={`${currentStyles.card} rounded-xl p-8 text-center`}>
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
                <p className={`${currentStyles.header} font-semibold mb-1`}>
                No hay tarjetas disponibles
                </p>
                <p className={`${currentStyles.subtitle} text-sm`}>
                No se encontraron tarjetas con saldo para este cliente
                </p>
            </div>
            )}
        </div>
      )}

      {/* Movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saldo */}
        <div className="space-y-3">
          <label className={`${currentStyles.label} text-sm flex items-center gap-2`}>
            <DollarSign className="w-4 h-4" />
            {formData.tipoMovimiento === 'nueva' ? 'Saldo Inicial (KG) *' : 'Saldo a Extraer (KG) *'}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max={formData.tipoMovimiento === 'extraer' ? formData.saldoDisponible : undefined}
              value={formData.saldo || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
              className={`${currentStyles.input} w-full px-4 py-4 text-sm font-semibold text-lg`}
              placeholder="0.00"
              required
              disabled={formData.tipoMovimiento === 'extraer' && !formData.tarjetaSeleccionadaId}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
              KG
            </span>
          </div>
          {formData.tipoMovimiento === 'extraer' && formData.saldoDisponible > 0 && (
            <p className="text-xs text-neutral-500">
              Disponible: <span className="font-bold">{formData.saldoDisponible.toFixed(2)} KG</span>
            </p>
          )}
        </div>

        {/* Importe Total */}
        <div className="space-y-3">
          <label className={`${currentStyles.label} text-sm flex items-center gap-2`}>
            <Receipt className="w-4 h-4" />
            Importe Total
          </label>
          <div className={`${currentStyles.statCardOrange} rounded-xl p-4`}>
            <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 mb-1">
              {formData.tipoMovimiento === 'nueva' ? 'TOTAL A PAGAR' : 'TOTAL A EXTRAER'}
            </p>
            <p className="text-3xl font-bold text-orange-800 dark:text-orange-200">
              ${formData.importeTotal.toFixed(2)}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              {formData.saldo} KG × ${formData.precioKG.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {currentStep === 2 && (
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`${currentStyles.buttonSecondary} px-8 py-3 text-sm flex items-center gap-2`}
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
            Regresar
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            disabled={
              formData.saldo <= 0 ||
              (formData.tipoMovimiento === 'extraer' && !formData.tarjetaSeleccionadaId)
            }
            className={`${currentStyles.button} px-8 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            Continuar
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
}