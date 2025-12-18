import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/src/lib/db/connection';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      tipoTarjetaId,
      clienteId,
      saldo,
      importeTotal,
      comprobante,
    } = body;

    // Validaciones
    if (!tipoTarjetaId || !clienteId || !saldo || !comprobante) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    // Obtener el siguiente ID
    const maxIdResult = await pool.request().query(`
      SELECT ISNULL(MAX(Id), 0) + 1 AS NextId FROM [Tarjetas]
    `);
    const nextId = maxIdResult.recordset[0].NextId;

    // Generar nombre del documento
    const now = new Date();
    const documentoNombre = `${comprobante}_${now.toISOString().replace(/[:.]/g, '-')}`;

    // Fecha de creación
    const fechaCreacion = now.toISOString();

    // Insertar tarjeta
    await pool
      .request()
      .input('Id', nextId)
      .input('TipoTarjetaId', tipoTarjetaId)
      .input('ClienteId', clienteId)
      .input('TarjetaMovimientoStatus', 0)
      .input('SaldoInicial', saldo)
      .input('Saldo', saldo)
      .input('ImporteTotal', importeTotal)
      .input('Comprobante', comprobante)
      .input('DocumentoUrl', 'N/A')
      .input('DocumentoNombre', documentoNombre)
      .input('DocumentoPublicId', 'N/A')
      .input('Status', 0)
      .input('FechaCreacion', fechaCreacion)
      .query(`
        INSERT INTO [Tarjetas] (
          Id, TipoTarjetaId, ClienteId, TarjetaMovimientoStatus,
          SaldoInicial, Saldo, ImporteTotal, Comprobante,
          DocumentoUrl, DocumentoNombre, DocumentoPublicId,
          Status, FechaCreacion
        ) VALUES (
          @Id, @TipoTarjetaId, @ClienteId, @TarjetaMovimientoStatus,
          @SaldoInicial, @Saldo, @ImporteTotal, @Comprobante,
          @DocumentoUrl, @DocumentoNombre, @DocumentoPublicId,
          @Status, @FechaCreacion
        )
      `);

    return NextResponse.json({
      success: true,
      message: 'Tarjeta registrada correctamente',
      data: { id: nextId },
    });
  } catch (error) {
    console.error('Error al registrar tarjeta:', error);
    return NextResponse.json(
      { success: false, error: 'Error al registrar tarjeta' },
      { status: 500 }
    );
  }
}