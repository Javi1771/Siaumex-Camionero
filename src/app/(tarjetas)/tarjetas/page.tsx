'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useToastHelpers } from '@/src/components/ui/toast';
import {
  CreditCard,
  FileText,
  Building2,
  AlertCircle
} from 'lucide-react';
import type { TipoTarjeta, HistorialMovimientos as HistorialType } from '@/src/types/tarjetas';
import { InformacionTarjeta } from './components/InformacionTarjeta';
import { TipoMovimiento } from './components/TipoMovimiento';
import { Documentos } from './components/Documentos';
import { HistorialMovimientos } from './components/HistorialMovimientos';
import { ProgressSteps } from './components/ProgressSteps';

export default function TarjetasPage() {
  const { theme } = useTheme();
  const toast = useToastHelpers();

  const [activeTab, setActiveTab] = useState<'registrar' | 'tipos' | 'emitidas'>('registrar');
  
  //* Estados del formulario
  const [tiposTarjetas, setTiposTarjetas] = useState<TipoTarjeta[]>([]);
  
  const [formData, setFormData] = useState({
    tipoTarjetaId: 0,
    precioKG: 0,
    clienteId: '',
    clienteNombre: '',
    vigencia: '',
    tipoMovimiento: 'nueva' as 'nueva' | 'extraer',
    saldo: 0,
    saldoDisponible: 0,
    importeTotal: 0,
    comprobante: '',
    documento: null as File | null,
    tarjetaSeleccionadaId: undefined as number | undefined,
  });

  const [historial, setHistorial] = useState<HistorialType | null>(null);
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const styles = {
    light: {
      container: 'bg-neutral-50',
      header: 'text-black',
      subtitle: 'text-neutral-600',
      card: 'bg-white border border-neutral-200',
      cardHover: 'hover:shadow-xl hover:border-neutral-300',
      tab: 'text-neutral-600 hover:bg-neutral-100 border-b-2 border-transparent',
      tabActive: 'text-black border-b-2 border-black bg-neutral-50',
      input: 'bg-white border-2 border-neutral-300 rounded-xl text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black',
      inputReadonly: 'bg-neutral-100 border-2 border-neutral-300 rounded-xl text-black font-semibold cursor-not-allowed',
      select: 'bg-white border-2 border-neutral-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black',
      button: 'bg-black text-white hover:bg-neutral-800 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl',
      buttonSecondary: 'bg-white text-black border-2 border-neutral-300 hover:border-black hover:bg-neutral-50 rounded-xl font-semibold transition-all shadow-md',
      buttonDanger: 'bg-red-600 text-white hover:bg-red-700 rounded-xl font-semibold transition-all',
      label: 'text-neutral-900 font-semibold',
      dropdown: 'bg-white border-2 border-neutral-300 rounded-xl shadow-2xl',
      dropdownItem: 'hover:bg-neutral-100 text-black border-b border-neutral-200 last:border-0',
      uploadArea: 'border-3 border-dashed border-neutral-400 bg-neutral-50 hover:border-black hover:bg-white',
      badge: 'bg-neutral-100 text-neutral-700 border-2 border-neutral-300',
      badgeSuccess: 'bg-green-100 text-green-700 border-2 border-green-300',
      badgeWarning: 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300',
      statCard: 'bg-gradient-to-br from-green-50 via-green-100 to-green-50 border-2 border-green-300 shadow-md',
      statCardBlue: 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-2 border-blue-300 shadow-md',
      statCardPurple: 'bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 border-2 border-purple-300 shadow-md',
      statCardOrange: 'bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 border-2 border-orange-300 shadow-md',
      divider: 'border-neutral-200',
      sectionBg: 'bg-neutral-100 border border-neutral-200',
      stepActive: 'bg-black text-white border-2 border-black shadow-lg',
      stepInactive: 'bg-white text-neutral-400 border-2 border-neutral-300',
      stepComplete: 'bg-green-600 text-white border-2 border-green-600 shadow-lg',
      movimientoActive: 'border-3 border-black bg-black text-white shadow-xl scale-105',
      movimientoInactive: 'border-2 border-neutral-300 bg-white hover:border-neutral-500 hover:shadow-md',
      movimientoActiveSubtext: 'text-neutral-200',
      movimientoInactiveSubtext: 'text-neutral-500',
    },
    dark: {
      container: 'bg-black',
      header: 'text-white',
      subtitle: 'text-neutral-400',
      card: 'bg-neutral-900 border border-neutral-800',
      cardHover: 'hover:shadow-2xl hover:border-neutral-600',
      tab: 'text-neutral-400 hover:bg-neutral-800 border-b-2 border-transparent',
      tabActive: 'text-white border-b-2 border-white bg-neutral-800',
      input: 'bg-neutral-800 border-2 border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white',
      inputReadonly: 'bg-neutral-800 border-2 border-neutral-700 rounded-xl text-white font-semibold cursor-not-allowed',
      select: 'bg-neutral-800 border-2 border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white',
      button: 'bg-white text-black hover:bg-neutral-200 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl',
      buttonSecondary: 'bg-neutral-800 text-white border-2 border-neutral-700 hover:border-white hover:bg-neutral-700 rounded-xl font-semibold transition-all shadow-md',
      buttonDanger: 'bg-red-600 text-white hover:bg-red-700 rounded-xl font-semibold transition-all',
      label: 'text-neutral-100 font-semibold',
      dropdown: 'bg-neutral-900 border-2 border-neutral-700 rounded-xl shadow-2xl',
      dropdownItem: 'hover:bg-neutral-800 text-white border-b border-neutral-800 last:border-0',
      uploadArea: 'border-3 border-dashed border-neutral-600 bg-neutral-900 hover:border-white hover:bg-neutral-800',
      badge: 'bg-neutral-800 text-neutral-300 border-2 border-neutral-700',
      badgeSuccess: 'bg-green-950 text-green-300 border-2 border-green-800',
      badgeWarning: 'bg-yellow-950 text-yellow-300 border-2 border-yellow-800',
      statCard: 'bg-gradient-to-br from-green-950 via-green-900 to-green-950 border-2 border-green-800 shadow-md',
      statCardBlue: 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 border-2 border-blue-800 shadow-md',
      statCardPurple: 'bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 border-2 border-purple-800 shadow-md',
      statCardOrange: 'bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950 border-2 border-orange-800 shadow-md',
      divider: 'border-neutral-800',
      sectionBg: 'bg-neutral-800 border border-neutral-700',
      stepActive: 'bg-white text-black border-2 border-white shadow-lg',
      stepInactive: 'bg-neutral-900 text-neutral-600 border-2 border-neutral-700',
      stepComplete: 'bg-green-600 text-white border-2 border-green-600 shadow-lg',
      movimientoActive: 'border-3 border-white bg-white text-black shadow-xl scale-105',
      movimientoInactive: 'border-2 border-neutral-700 bg-neutral-900 hover:border-neutral-500 hover:shadow-md',
      movimientoActiveSubtext: 'text-neutral-700',
      movimientoInactiveSubtext: 'text-neutral-400',
    },
  };

  const currentStyles = styles[theme];

  //* Cargar tipos de tarjetas
  useEffect(() => {
    fetchTiposTarjetas();
  }, []);

  //* Cargar historial cuando se selecciona un cliente
  useEffect(() => {
    if (formData.clienteId) {
      fetchHistorial(formData.clienteId);
    }
  }, [formData.clienteId, filtroFechaDesde, filtroFechaHasta]);

  //* Calcular importe total
  useEffect(() => {
    const importe = formData.saldo * formData.precioKG;
    setFormData(prev => ({ ...prev, importeTotal: importe }));
  }, [formData.saldo, formData.precioKG]);

  const fetchTiposTarjetas = async () => {
    try {
      const response = await fetch('/api/tarjetas/tipos');
      const data = await response.json();
      if (data.success) {
        setTiposTarjetas(data.data);
      }
    } catch (error) {
      console.error('Error al cargar tipos de tarjetas:', error);
    }
  };

  const fetchHistorial = async (clienteId: string) => {
    try {
      let url = `/api/tarjetas/historial?clienteId=${encodeURIComponent(clienteId)}`;
      if (filtroFechaDesde && filtroFechaHasta) {
        url += `&fechaDesde=${filtroFechaDesde}&fechaHasta=${filtroFechaHasta}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setHistorial(data.data);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  const handleTipoTarjetaChange = (tipoId: number) => {
    const tipo = tiposTarjetas.find(t => t.Id === tipoId);
    setFormData(prev => ({
      ...prev,
      tipoTarjetaId: tipoId,
      precioKG: tipo?.PrecioKG || 0,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, documento: file }));
    } else {
      toast.error('Solo se permiten archivos PDF');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const endpoint = formData.tipoMovimiento === 'nueva' 
        ? '/api/tarjetas/registrar' 
        : '/api/tarjetas/extraer';

      const body = formData.tipoMovimiento === 'nueva'
        ? {
            tipoTarjetaId: formData.tipoTarjetaId,
            clienteId: formData.clienteId,
            saldo: formData.saldo,
            importeTotal: formData.importeTotal,
            comprobante: formData.comprobante,
          }
        : {
            tarjetaId: formData.tarjetaSeleccionadaId,
            saldoAExtraer: formData.saldo,
            precioKG: formData.precioKG,
            clienteId: formData.clienteId,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          formData.tipoMovimiento === 'nueva' 
            ? 'Tarjeta registrada correctamente' 
            : 'Saldo extraído correctamente'
        );
        
        //! Limpiar formulario
        setFormData({
          tipoTarjetaId: 0,
          precioKG: 0,
          clienteId: '',
          clienteNombre: '',
          vigencia: '',
          tipoMovimiento: 'nueva',
          saldo: 0,
          saldoDisponible: 0,
          importeTotal: 0,
          comprobante: '',
          documento: null,
          tarjetaSeleccionadaId: undefined,
        });
        setHistorial(null);
        setCurrentStep(1);
      } else {
        toast.error(data.error || 'Error en la operación');
      }
    } catch (error) {
      toast.error('Error de conexión');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltroFechaDesde('');
    setFiltroFechaHasta('');
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, documento: null }));
  };

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`${currentStyles.header} text-4xl font-bold`}>
                  Gestión de Tarjetas
                </h1>
              </div>
            </div>
            <p className={`${currentStyles.subtitle} text-base ml-[68px]`}>
              Administra, controla y gestiona las Tarjetas registradas en el sistema
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`${currentStyles.card} rounded-2xl p-2`}>
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('registrar')}
            className={`${
              activeTab === 'registrar' ? currentStyles.tabActive : currentStyles.tab
            } flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap rounded-xl flex-1 sm:flex-initial`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Registrar Tarjetas</span>
          </button>
          <button
            onClick={() => setActiveTab('tipos')}
            className={`${
              activeTab === 'tipos' ? currentStyles.tabActive : currentStyles.tab
            } flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap rounded-xl flex-1 sm:flex-initial`}
          >
            <FileText className="w-5 h-5" />
            <span>Tipos de Tarjetas</span>
          </button>
          <button
            onClick={() => setActiveTab('emitidas')}
            className={`${
              activeTab === 'emitidas' ? currentStyles.tabActive : currentStyles.tab
            } flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap rounded-xl flex-1 sm:flex-initial`}
          >
            <Building2 className="w-5 h-5" />
            <span>Tarjetas Emitidas</span>
          </button>
        </div>
      </div>

      {/* Contenido */}
      {activeTab === 'registrar' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Formulario - 8 columnas */}
          <div className="xl:col-span-8 space-y-6">
            {/* Progress Steps */}
            <ProgressSteps currentStyles={currentStyles} currentStep={currentStep} />

            {/* Paso 1: Información */}
            {currentStep >= 1 && (
              <InformacionTarjeta
                theme={theme}
                currentStyles={currentStyles}
                formData={formData}
                setFormData={setFormData}
                tiposTarjetas={tiposTarjetas}
                handleTipoTarjetaChange={handleTipoTarjetaChange}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            )}

            {/* Paso 2: Tipo de Movimiento */}
            {currentStep >= 2 && (
              <TipoMovimiento
                theme={theme}
                currentStyles={currentStyles}
                formData={formData}
                setFormData={setFormData}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            )}

            {/* Paso 3: Documentos */}
            {currentStep >= 3 && (
              <Documentos
                theme={theme}
                currentStyles={currentStyles}
                formData={formData}
                setFormData={setFormData}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onFileChange={handleFileChange}
                removeFile={removeFile}
              />
            )}
          </div>

          {/* Historial - 4 columnas */}
          <div className="xl:col-span-4">
            <HistorialMovimientos
              theme={theme}
              currentStyles={currentStyles}
              clienteId={formData.clienteId}
              historial={historial}
              filtroFechaDesde={filtroFechaDesde}
              filtroFechaHasta={filtroFechaHasta}
              setFiltroFechaDesde={setFiltroFechaDesde}
              setFiltroFechaHasta={setFiltroFechaHasta}
              limpiarFiltros={limpiarFiltros}
            />
          </div>
        </div>
      )}

      {/* Tabs Tipos y Emitidas */}
      {activeTab === 'tipos' && (
        <div className={`${currentStyles.card} rounded-2xl p-12 text-center`}>
          <div className="max-w-md mx-auto">
            <div className="inline-block p-8 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 rounded-3xl mb-6">
              <FileText className="w-20 h-20 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className={`${currentStyles.header} text-2xl font-bold mb-3`}>
              Tipos de Tarjetas
            </h3>
            <p className={`${currentStyles.subtitle} text-base mb-6`}>
              Esta sección estará disponible próximamente
            </p>
            <div className={`${currentStyles.badge} inline-flex items-center gap-2 px-4 py-2 rounded-full`}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">En desarrollo</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'emitidas' && (
        <div className={`${currentStyles.card} rounded-2xl p-12 text-center`}>
          <div className="max-w-md mx-auto">
            <div className="inline-block p-8 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900 rounded-3xl mb-6">
              <Building2 className="w-20 h-20 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className={`${currentStyles.header} text-2xl font-bold mb-3`}>
              Tarjetas Emitidas
            </h3>
            <p className={`${currentStyles.subtitle} text-base mb-6`}>
              Esta sección estará disponible próximamente
            </p>
            <div className={`${currentStyles.badge} inline-flex items-center gap-2 px-4 py-2 rounded-full`}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">En desarrollo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}