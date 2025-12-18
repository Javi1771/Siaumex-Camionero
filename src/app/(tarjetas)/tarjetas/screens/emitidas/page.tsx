'use client';

import { TarjetasTabs } from '../../components/TarjetasTabs';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function TarjetasEmitidasPage() {
  const { theme } = useTheme();

  const styles = {
    light: {
      card: 'bg-white border border-neutral-200',
      tab: 'text-neutral-600 hover:bg-neutral-100 border-b-2 border-transparent',
      tabActive: 'text-black border-b-2 border-black bg-neutral-50',
      header: 'text-black',
      subtitle: 'text-neutral-600',
    },
    dark: {
      card: 'bg-neutral-900 border border-neutral-800',
      tab: 'text-neutral-400 hover:bg-neutral-800 border-b-2 border-transparent',
      tabActive: 'text-white border-b-2 border-white bg-neutral-800',
      header: 'text-white',
      subtitle: 'text-neutral-400',
    },
  };

  const currentStyles = styles[theme];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`${currentStyles.header} text-4xl font-bold`}>
              Tarjetas Emitidas
            </h1>
            <p className={`${currentStyles.subtitle} text-base`}>
              Consulta y gestiona las tarjetas que han sido emitidas
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Component */}
      <TarjetasTabs 
        currentStyles={currentStyles} 
        activeTab="emitidas" 
      />

      {/* Contenido específico de Tarjetas Emitidas */}
      <div className={`${currentStyles.card} rounded-2xl p-8`}>
        <h2 className={`${currentStyles.header} text-2xl font-bold mb-4`}>
          Contenido de Tarjetas Emitidas
        </h2>
        <p className={`${currentStyles.subtitle}`}>
          Aquí irá el contenido para consultar y gestionar las tarjetas emitidas...
        </p>
      </div>
    </div>
  );
}