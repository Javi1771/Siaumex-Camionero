export interface TipoTarjeta {
  Id: number;
  Nombre: string;
  PrecioKG: number;
}

export interface Cliente {
  RFC: string;
  Nombre: string;
  Vigencia: string;
}

export interface Tarjeta {
  Id: number;
  TipoTarjetaId: number;
  ClienteId: string;
  TarjetaMovimientoStatus: number;
  SaldoInicial: number;
  Saldo: number;
  ImporteTotal: number;
  Comprobante: string;
  DocumentoUrl: string;
  DocumentoNombre: string;
  DocumentoPublicId: string;
  Status: number;
  FechaCreacion: string;
}

export interface TarjetaDisponible {
  Id: number;
  TipoTarjeta: string;
  PrecioKG: number;
  SaldoActual: number;
  MaximoEquivalente: number;
  Status: number;
}

export interface TarjetaMovimiento {
  Id: number;
  ClienteId: string;
  SaldoFinal: number;
  ImporteTotal: number;
  Fecha: string;
}

export interface HistorialMovimientos {
  saldoActual: number;
  importeTotal: number;
  totalMovimientos: number;
  movimientos: TarjetaMovimiento[];
}

export interface FormularioTarjeta {
  tipoTarjetaId: number;
  precioKG: number;
  clienteId: string;
  clienteNombre: string;
  vigencia: string;
  tipoMovimiento: 'nueva' | 'extraer';
  saldo: number;
  importeTotal: number;
  comprobante: string;
  documento: File | null;
  // Para extraer saldo
  tarjetaSeleccionadaId?: number;
}