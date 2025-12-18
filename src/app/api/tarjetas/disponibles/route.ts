import { NextResponse } from 'next/server';
import { getConnection } from '@/src/lib/db/connection';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('clienteId');

    if (!clienteId) {
      return NextResponse.json(
        { success: false, error: 'ClienteId es requerido' },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    // Obtener todas las tarjetas del cliente con su último movimiento
    const result = await pool
      .request()
      .input('clienteId', clienteId)
      .query(`
        WITH UltimosMovimientos AS (
          SELECT 
            TarjetaOrigenDestinoId,
            SaldoFinal,
            ROW_NUMBER() OVER (PARTITION BY TarjetaOrigenDestinoId ORDER BY Fecha DESC) as rn
          FROM [TarjetaMovimientos]
          WHERE ClienteId = @clienteId
        )
        SELECT 
          t.Id,
          tt.Nombre as TipoTarjeta,
          tt.PrecioKG,
          COALESCE(um.SaldoFinal, t.Saldo) as SaldoActual,
          COALESCE(um.SaldoFinal, t.Saldo) * tt.PrecioKG as MaximoEquivalente,
          t.Status
        FROM [Tarjetas] t
        INNER JOIN [TipoTarjetas] tt ON t.TipoTarjetaId = tt.Id
        LEFT JOIN UltimosMovimientos um ON t.Id = um.TarjetaOrigenDestinoId AND um.rn = 1
        WHERE t.ClienteId = @clienteId 
          AND t.Status = 0
          AND COALESCE(um.SaldoFinal, t.Saldo) > 0
        ORDER BY t.Id DESC
      `);

    return NextResponse.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error al obtener tarjetas disponibles:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener tarjetas disponibles' },
      { status: 500 }
    );
  }
}