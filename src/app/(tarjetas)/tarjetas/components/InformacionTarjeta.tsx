'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  Calendar, 
  Search,
  ChevronDown 
} from 'lucide-react';
import type { TipoTarjeta, Cliente } from '@/src/types/tarjetas';

interface InformacionTarjetaProps {
  theme: 'light' | 'dark';
  currentStyles: any;
  formData: any;
  setFormData: (data: any) => void;
  tiposTarjetas: TipoTarjeta[];
  handleTipoTarjetaChange: (tipoId: number) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export function InformacionTarjeta({
  theme,
  currentStyles,
  formData,
  setFormData,
  tiposTarjetas,
  handleTipoTarjetaChange,
  currentStep,
  setCurrentStep,
}: InformacionTarjetaProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchCliente, setSearchCliente] = useState('');
  const [showClientesDropdown, setShowClientesDropdown] = useState(false);

  useEffect(() => {
    if (searchCliente.length >= 2) {
      fetchClientes(searchCliente);
    } else {
      setClientes([]);
    }
  }, [searchCliente]);

  const fetchClientes = async (search: string) => {
    try {
      const response = await fetch(`/api/tarjetas/clientes?search=${encodeURIComponent(search)}`);
      const data = await response.json();
      if (data.success) {
        setClientes(data.data);
        setShowClientesDropdown(true);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const handleClienteSelect = (cliente: Cliente) => {
    setFormData((prev: any) => ({
      ...prev,
      clienteId: cliente.RFC,
      clienteNombre: cliente.Nombre,
      vigencia: cliente.Vigencia,
    }));
    setSearchCliente(cliente.Nombre);
    setShowClientesDropdown(false);
  };

  return (
    <div className={`${currentStyles.card} rounded-2xl p-8 space-y-6 ${currentStyles.cardHover} transition-all`}>
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="p-2.5 bg-blue-100 dark:bg-blue-950 rounded-xl">
          <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className={`${currentStyles.header} text-xl font-bold`}>
            Información de la Tarjeta
          </h3>
          <p className={`${currentStyles.subtitle} text-sm`}>
            Selecciona el tipo de tarjeta y el cliente
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipo de Tarjeta */}
        <div className="space-y-3">
          <label className={`${currentStyles.label} text-sm flex items-center gap-2`}>
            <CreditCard className="w-4 h-4" />
            Tipo de Tarjeta *
          </label>
          <div className="relative">
            <select
              value={formData.tipoTarjetaId}
              onChange={(e) => handleTipoTarjetaChange(Number(e.target.value))}
              className={`${currentStyles.select} w-full pl-4 pr-10 py-4 text-sm font-medium appearance-none cursor-pointer`}
              required
            >
              <option value={0}>Selecciona un tipo de tarjeta</option>
              {tiposTarjetas.map((tipo) => (
                <option key={tipo.Id} value={tipo.Id}>
                  {tipo.Nombre}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        {/* Precio KG */}
        <div className="space-y-3">
          <label className={`${currentStyles.label} text-sm flex items-center gap-2`}>
            <DollarSign className="w-4 h-4" />
            Precio por KG
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="number"
              value={formData.precioKG}
              readOnly
              className={`${currentStyles.inputReadonly} w-full pl-12 pr-4 py-4 text-sm`}
            />
          </div>
        </div>
      </div>

      {/* Cliente - Buscador */}
      <div className="space-y-3">
        <label className={`${currentStyles.label} text-sm flex items-center gap-2`}>
          <Users className="w-4 h-4" />
          Cliente *
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 z-10" />
          <input
            type="text"
            value={searchCliente}
            onChange={(e) => setSearchCliente(e.target.value)}
            onFocus={() => clientes.length > 0 && setShowClientesDropdown(true)}
            className={`${currentStyles.input} w-full pl-12 pr-4 py-4 text-sm`}
            placeholder="Buscar por nombre o RFC..."
            required
          />
          
          {/* Dropdown */}
          {showClientesDropdown && clientes.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 ${currentStyles.dropdown} max-h-80 overflow-y-auto z-30`}>
              {clientes.map((cliente) => (
                <button
                  key={cliente.RFC}
                  type="button"
                  onClick={() => handleClienteSelect(cliente)}
                  className={`${currentStyles.dropdownItem} w-full px-6 py-4 text-left transition-all group`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cliente.Nombre}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        RFC: {cliente.RFC}
                      </p>
                    </div>
                    <ChevronDown className="w-5 h-5 -rotate-90 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Info del cliente seleccionado */}
        {formData.clienteId && (
          <div className={`${currentStyles.sectionBg} rounded-xl p-4 space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Cliente seleccionado
              </span>
              <span className={`${currentStyles.badgeSuccess} px-3 py-1 rounded-full text-xs font-semibold`}>
                Activo
              </span>
            </div>
            <p className={`${currentStyles.header} font-semibold`}>
              {formData.clienteNombre}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              RFC: {formData.clienteId}
            </p>
          </div>
        )}
      </div>

      {/* Vigencia */}
      {formData.vigencia && (
        <div className="space-y-3">
          <label className={`${currentStyles.label} text-sm flex items-center gap-2`}>
            <Calendar className="w-4 h-4" />
            Vigencia
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              value={new Date(formData.vigencia).toLocaleDateString('es-MX', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              readOnly
              className={`${currentStyles.inputReadonly} w-full pl-12 pr-4 py-4 text-sm`}
            />
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            disabled={!formData.tipoTarjetaId || !formData.clienteId}
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