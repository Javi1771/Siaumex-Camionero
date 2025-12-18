'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { TipoTarjetaCompleto } from '@/src/types/tarjetas';

interface ModalTipoTarjetaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  tipoTarjeta?: TipoTarjetaCompleto | null;
  currentStyles: any;
}

export function ModalTipoTarjeta({
  isOpen,
  onClose,
  onSave,
  tipoTarjeta,
  currentStyles,
}: ModalTipoTarjetaProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    description: '',
    precioKG: 0,
  });

  useEffect(() => {
    if (tipoTarjeta) {
      setFormData({
        nombre: tipoTarjeta.Nombre,
        description: tipoTarjeta.Description || '',
        precioKG: tipoTarjeta.PrecioKG,
      });
    } else {
      setFormData({
        nombre: '',
        description: '',
        precioKG: 0,
      });
    }
  }, [tipoTarjeta, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`${currentStyles.card} rounded-3xl p-8 max-w-2xl w-full relative z-10 shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className={`${currentStyles.header} text-2xl font-bold`}>
            {tipoTarjeta ? 'Editar Tipo de Tarjeta' : 'Nuevo Tipo de Tarjeta'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className={`${currentStyles.label} text-sm`}>
              Nombre *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              className={`${currentStyles.input} w-full px-4 py-3 text-sm`}
              placeholder="Ej: BASURA, ESCOMBRO, etc."
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className={`${currentStyles.label} text-sm`}>
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={`${currentStyles.input} w-full px-4 py-3 text-sm min-h-[100px]`}
              placeholder="Descripción del tipo de tarjeta..."
              rows={4}
            />
          </div>

          {/* Precio */}
          <div className="space-y-2">
            <label className={`${currentStyles.label} text-sm`}>
              Precio por KG *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.precioKG}
                onChange={(e) => setFormData(prev => ({ ...prev, precioKG: parseFloat(e.target.value) || 0 }))}
                className={`${currentStyles.input} w-full pl-8 pr-4 py-3 text-sm font-semibold`}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`${currentStyles.buttonSecondary} flex-1 px-6 py-3 text-sm`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${currentStyles.button} flex-1 px-6 py-3 text-sm flex items-center justify-center gap-2`}
            >
              <Save className="w-4 h-4" />
              {tipoTarjeta ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}