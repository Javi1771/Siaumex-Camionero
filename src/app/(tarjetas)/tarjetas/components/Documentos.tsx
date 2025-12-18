'use client';

import { 
  FileText, 
  Upload, 
  Receipt,
  ChevronDown,
  CheckCircle2,
  X
} from 'lucide-react';

interface DocumentosProps {
  theme: 'light' | 'dark';
  currentStyles: any;
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLoading: boolean;
  onSubmit: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: () => void;
}

export function Documentos({
  theme,
  currentStyles,
  formData,
  setFormData,
  currentStep,
  setCurrentStep,
  isLoading,
  onSubmit,
  onFileChange,
  removeFile,
}: DocumentosProps) {
  return (
    <div className={`${currentStyles.card} rounded-2xl p-8 space-y-6 ${currentStyles.cardHover} transition-all`}>
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="p-2.5 bg-green-100 dark:bg-green-950 rounded-xl">
          <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className={`${currentStyles.header} text-xl font-bold`}>
            Documentos
          </h3>
          <p className={`${currentStyles.subtitle} text-sm`}>
            Adjunta el comprobante y documento PDF
          </p>
        </div>
      </div>

      {/* Número de Comprobante */}
      <div className="space-y-3">
        <label className={`${currentStyles.label} text-sm flex items-center gap-2`}>
          <Receipt className="w-4 h-4" />
          Número de Comprobante *
        </label>
        <div className="relative">
          <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={formData.comprobante}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, comprobante: e.target.value }))}
            className={`${currentStyles.input} w-full pl-12 pr-4 py-4 text-sm font-medium`}
            placeholder="Ej: COMP-2024-001"
            required
          />
        </div>
      </div>

      {/* Upload de PDF */}
      <div className="space-y-3">
        <label className={`${currentStyles.label} text-sm flex items-center gap-2`}>
          <Upload className="w-4 h-4" />
          Documento PDF (Opcional)
        </label>
        
        {!formData.documento ? (
          <div className={`${currentStyles.uploadArea} rounded-2xl p-12 text-center cursor-pointer transition-all group`}>
            <input
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <div className="inline-block p-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-12 h-12 text-neutral-400" />
              </div>
              <p className={`${currentStyles.header} text-base font-semibold mb-2`}>
                Arrastra un archivo o haz clic para seleccionar
              </p>
              <p className="text-sm text-neutral-500">
                Solo archivos PDF • Máx. 10MB
              </p>
            </label>
          </div>
        ) : (
          <div className={`${currentStyles.card} rounded-2xl p-6 border-2 border-green-200 dark:border-green-800`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-950 rounded-xl">
                  <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className={`${currentStyles.header} font-semibold`}>
                    {formData.documento.name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {(formData.documento.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-950 rounded-xl transition-all text-red-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botones finales */}
      {currentStep === 3 && (
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`${currentStyles.buttonSecondary} px-8 py-3 text-sm flex items-center justify-center gap-2`}
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
            Regresar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !formData.comprobante}
            className={`${currentStyles.button} px-8 py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-1 sm:flex-initial`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                <span className="font-bold">
                  {formData.tipoMovimiento === 'nueva' ? 'Registrando...' : 'Extrayendo...'}
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">
                  {formData.tipoMovimiento === 'nueva' ? 'REGISTRAR TARJETA' : 'EXTRAER SALDO'}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}