'use client';

import { useState, useEffect } from 'react';
import { TarjetasTabs } from '../../components/TarjetasTabs';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useToastHelpers } from '@/src/components/ui/toast';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import type { TipoTarjetaCompleto } from '@/src/types/tarjetas';
import { ModalTipoTarjeta } from './components/ModalTipoTarjeta';

export default function TiposTarjetasPage() {
  const { theme } = useTheme();
  const toast = useToastHelpers();

  const [tiposTarjetas, setTiposTarjetas] = useState<TipoTarjetaCompleto[]>([]);
  const [filteredTarjetas, setFilteredTarjetas] = useState<TipoTarjetaCompleto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTarjeta, setSelectedTarjeta] = useState<TipoTarjetaCompleto | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    tarjeta: TipoTarjetaCompleto | null;
  }>({
    isOpen: false,
    tarjeta: null
  });

  const styles = {
    light: {
      container: 'bg-neutral-50',
      card: 'bg-white border border-neutral-200 shadow-sm',
      tab: 'text-neutral-600 hover:bg-neutral-100 border-b-2 border-transparent',
      tabActive: 'text-black border-b-2 border-black bg-neutral-50',
      header: 'text-black',
      subtitle: 'text-neutral-600',
      input: 'bg-white border-2 border-neutral-300 rounded-xl text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black',
      button: 'bg-black text-white hover:bg-neutral-800 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl',
      buttonSecondary: 'bg-white text-black border-2 border-neutral-300 hover:border-black hover:bg-neutral-50 rounded-xl font-semibold transition-all shadow-md',
      buttonEdit: 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all p-2 flex items-center justify-center',
      buttonDelete: 'bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all p-2 flex items-center justify-center',
      table: 'bg-white border border-neutral-200 shadow-sm rounded-2xl overflow-hidden',
      tableHeader: 'bg-gradient-to-r from-neutral-50 to-neutral-100 text-neutral-700 border-b-2 border-neutral-300',
      tableRow: 'border-b border-neutral-200 hover:bg-neutral-50 transition-colors',
      tableRowEven: 'bg-neutral-50/50',
      tableCell: 'text-neutral-800',
      badge: 'bg-neutral-100 text-neutral-700 border-2 border-neutral-300',
      badgeSuccess: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-300',
      badgeInactive: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-300',
      label: 'text-neutral-900 font-semibold',
      modalBg: 'bg-white',
      modalHeader: 'bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200',
      modalButtonConfirm: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800',
      modalButtonCancel: 'bg-gradient-to-r from-neutral-200 to-neutral-300 text-neutral-800 hover:from-neutral-300 hover:to-neutral-400',
      priceCell: 'font-mono font-bold text-green-700 bg-green-50/50 px-3 py-2 rounded-lg',
    },
    dark: {
      container: 'bg-neutral-950',
      card: 'bg-neutral-900 border border-neutral-800 shadow-lg',
      tab: 'text-neutral-400 hover:bg-neutral-800 border-b-2 border-transparent',
      tabActive: 'text-white border-b-2 border-white bg-neutral-800',
      header: 'text-white',
      subtitle: 'text-neutral-400',
      input: 'bg-neutral-800 border-2 border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white',
      button: 'bg-white text-black hover:bg-neutral-200 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl',
      buttonSecondary: 'bg-neutral-800 text-white border-2 border-neutral-700 hover:border-white hover:bg-neutral-700 rounded-xl font-semibold transition-all shadow-md',
      buttonEdit: 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all p-2 flex items-center justify-center',
      buttonDelete: 'bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all p-2 flex items-center justify-center',
      table: 'bg-neutral-900 border border-neutral-700 shadow-lg rounded-2xl overflow-hidden',
      tableHeader: 'bg-gradient-to-r from-neutral-800 to-neutral-900 text-neutral-200 border-b-2 border-neutral-700',
      tableRow: 'border-b border-neutral-800 hover:bg-neutral-800/80 transition-colors',
      tableRowEven: 'bg-neutral-800/50',
      tableCell: 'text-neutral-200',
      badge: 'bg-neutral-800 text-neutral-200 border-2 border-neutral-700',
      badgeSuccess: 'bg-gradient-to-r from-green-900/80 to-green-800/80 text-green-300 border border-green-700',
      badgeInactive: 'bg-gradient-to-r from-red-900/80 to-red-800/80 text-red-300 border border-red-700',
      label: 'text-neutral-100 font-semibold',
      modalBg: 'bg-neutral-900',
      modalHeader: 'bg-gradient-to-r from-red-900/30 to-red-800/30 border-b border-red-800',
      modalButtonConfirm: 'bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-800 hover:to-red-900',
      modalButtonCancel: 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-200 hover:from-neutral-800 hover:to-neutral-900',
      priceCell: 'font-mono font-bold text-green-300 bg-green-900/30 px-3 py-2 rounded-lg',
    },
  };

  const currentStyles = styles[theme];

  useEffect(() => {
    fetchTiposTarjetas();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = tiposTarjetas.filter(
        (tipo) =>
          tipo.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tipo.Description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTarjetas(filtered);
    } else {
      setFilteredTarjetas(tiposTarjetas);
    }
  }, [searchTerm, tiposTarjetas]);

  const fetchTiposTarjetas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tarjetas/tipos');
      const data = await response.json();
      if (data.success) {
        setTiposTarjetas(data.data);
        setFilteredTarjetas(data.data);
      }
    } catch (error) {
      console.error('Error al cargar tipos de tarjetas:', error);
      toast.error('Error al cargar tipos de tarjetas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTarjeta(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tarjeta: TipoTarjetaCompleto) => {
    setSelectedTarjeta(tarjeta);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    try {
      const method = selectedTarjeta ? 'PUT' : 'POST';
      const body = selectedTarjeta
        ? { id: selectedTarjeta.Id, ...formData }
        : formData;

      const response = await fetch('/api/tarjetas/tipos', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          selectedTarjeta
            ? 'Tipo de tarjeta actualizado correctamente'
            : 'Tipo de tarjeta creado correctamente'
        );
        setIsModalOpen(false);
        fetchTiposTarjetas();
      } else {
        toast.error(data.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/tarjetas/tipos?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Tipo de tarjeta inactivado correctamente');
        setConfirmDelete({ isOpen: false, tarjeta: null });
        fetchTiposTarjetas();
      } else {
        toast.error(data.error || 'Error al inactivar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  // Formatear precio sin redondear
  const formatPrecioExacto = (precio: number): string => {
    // Convertir a string y eliminar ceros innecesarios al final
    const str = precio.toString();
    if (str.includes('.')) {
      const parts = str.split('.');
      // Mantener hasta 8 decimales si es necesario
      const decimalPart = parts[1].length > 8 ? parts[1].substring(0, 8) : parts[1];
      // Eliminar ceros al final del decimal
      const trimmedDecimal = decimalPart.replace(/0+$/, '');
      return trimmedDecimal ? `${parts[0]}.${trimmedDecimal}` : parts[0];
    }
    return str;
  };

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`${currentStyles.header} text-4xl font-bold`}>
                  Tipos de Tarjetas
                </h1>
              </div>
            </div>
            <p className={`${currentStyles.subtitle} text-base ml-[68px]`}>
              Gestiona los diferentes tipos de tarjetas disponibles en el sistema
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Component */}
      <TarjetasTabs currentStyles={currentStyles} activeTab="tipos" />

      {/* Acciones y Búsqueda */}
      <div className={`${currentStyles.card} rounded-2xl p-6`}>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Búsqueda */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className={`${currentStyles.input} w-full pl-12 pr-4 py-3 text-sm`}
            />
          </div>

          {/* Botón Crear */}
          <button
            onClick={handleCreate}
            className={`${currentStyles.button} px-6 py-3 text-sm flex items-center gap-2 whitespace-nowrap transition-all duration-300 hover:scale-[1.02]`}
          >
            <Plus className="w-5 h-5" />
            Nuevo Tipo
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className={currentStyles.table}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-black'}`}></div>
          </div>
        ) : filteredTarjetas.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-600" />
            <p className={`${currentStyles.header} text-lg font-semibold mb-2`}>
              No se encontraron tipos de tarjetas
            </p>
            <p className={currentStyles.subtitle}>
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Crea tu primer tipo de tarjeta'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={currentStyles.tableHeader}>
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-sm">ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Nombre</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Descripción</th>
                  <th className="text-right py-4 px-6 font-semibold text-sm">Precio/KG</th>
                  <th className="text-center py-4 px-6 font-semibold text-sm">Estado</th>
                  <th className="text-center py-4 px-6 font-semibold text-sm">Fecha Creación</th>
                  <th className="text-center py-4 px-6 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTarjetas.map((tipo, index) => (
                  <tr 
                    key={tipo.Id} 
                    className={`${currentStyles.tableRow} ${index % 2 === 0 ? currentStyles.tableRowEven : ''}`}
                  >
                    <td className={`py-4 px-6 font-mono text-sm font-bold ${currentStyles.tableCell}`}>
                      {tipo.Id}
                    </td>
                    <td className={`py-4 px-6 font-semibold ${currentStyles.tableCell}`}>
                      {tipo.Nombre}
                    </td>
                    <td className={`py-4 px-6 text-sm ${currentStyles.tableCell}`}>
                      {tipo.Description || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <div className={`${currentStyles.priceCell} inline-block text-right`}>
                        ${formatPrecioExacto(tipo.PrecioKG)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`${
                          tipo.Status === 0
                            ? currentStyles.badgeSuccess
                            : currentStyles.badgeInactive
                        } inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300`}
                      >
                        {tipo.Status === 0 ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Activo
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Inactivo
                          </>
                        )}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-center text-sm ${currentStyles.tableCell}`}>
                      {new Date(tipo.CreateDate).toLocaleDateString('es-MX')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(tipo)}
                          className={`${currentStyles.buttonEdit} transition-all duration-300 hover:scale-110`}
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {tipo.Status === 0 && (
                          <button
                            onClick={() => setConfirmDelete({ isOpen: true, tarjeta: tipo })}
                            className={`${currentStyles.buttonDelete} transition-all duration-300 hover:scale-110`}
                            title="Inactivar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {confirmDelete.isOpen && confirmDelete.tarjeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmDelete({ isOpen: false, tarjeta: null })}
          />
          
          {/* Modal */}
          <div className={`${currentStyles.modalBg} rounded-2xl shadow-2xl w-full max-w-md relative z-10 border ${theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}`}>
            {/* Header */}
            <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-red-900/30 to-red-800/30 border-b border-red-800' : 'bg-gradient-to-r from-red-100 to-red-50 border-b border-red-200'} rounded-t-2xl p-6`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 ${theme === 'dark' ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-red-500 to-red-600'} rounded-xl`}>
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                    Confirmar Inactivación
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} mt-1`}>
                    Esta acción no se puede deshacer
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <p className={`font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>
                  ¿Estás seguro de que deseas inactivar el tipo de tarjeta?
                </p>
                
                <div className={`${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-white border border-neutral-300 shadow-sm'} rounded-xl p-4`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} mb-2`}>
                        Nombre
                      </p>
                      <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                        {confirmDelete.tarjeta.Nombre}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} mb-2`}>
                        Precio/KG
                      </p>
                      <p className={`font-mono font-bold text-lg ${theme === 'dark' ? 'text-green-300' : 'text-green-700 bg-green-50 px-2 py-1 rounded'}`}>
                        ${formatPrecioExacto(confirmDelete.tarjeta.PrecioKG)}
                      </p>
                    </div>
                    <div className="col-span-2 pt-3 border-t border-neutral-300 dark:border-neutral-700">
                      <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} mb-2`}>
                        Descripción
                      </p>
                      <div className={`${theme === 'dark' ? 'bg-neutral-800/30' : 'bg-neutral-100'} rounded-lg p-3`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>
                          {confirmDelete.tarjeta.Description || 'Sin descripción'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${theme === 'dark' ? 'bg-red-900/20' : 'bg-gradient-to-r from-red-50 to-red-100'} rounded-xl p-4 border ${theme === 'dark' ? 'border-red-800' : 'border-red-300 shadow-sm'}`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                    <div>
                      <p className={`font-semibold ${theme === 'dark' ? 'text-red-300' : 'text-red-700'} mb-1`}>
                        Advertencia
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                        Al inactivar esta tarjeta, ya no estará disponible para nuevas asignaciones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => setConfirmDelete({ isOpen: false, tarjeta: null })}
                className={`${theme === 'dark' ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' : 'bg-white border-2 border-neutral-300 hover:border-neutral-500 hover:bg-neutral-50 text-neutral-800'} flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg`}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.tarjeta!.Id)}
                className={`${theme === 'dark' ? 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900' : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-2 border-red-600'} text-white flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg`}
              >
                Sí, Inactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Tipo de Tarjeta */}
      <ModalTipoTarjeta
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        tipoTarjeta={selectedTarjeta}
        currentStyles={currentStyles}
      />
    </div>
  );
}