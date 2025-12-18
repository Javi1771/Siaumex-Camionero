import { NextResponse } from 'next/server';
import { getConnection } from '@/src/lib/db/connection';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('clienteId');
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');

    if (!clienteId) {
      return NextResponse.json(
        { success: false, error: 'ClienteId es requerido' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    
    let query = `
      SELECT 
        Id,
        ClienteId,
        SaldoFinal,
        ImporteTotal,
        Fecha
      FROM [TarjetaMovimientos]
      WHERE ClienteId = @clienteId
    `;

    const params: any = { clienteId };

    if (fechaDesde && fechaHasta) {
      query += ` AND Fecha BETWEEN @fechaDesde AND @fechaHasta`;
      params.fechaDesde = fechaDesde;
      params.fechaHasta = fechaHasta;
    }

    query += ` ORDER BY Fecha DESC`;

    const sqlRequest = pool.request();
    Object.keys(params).forEach(key => {
      sqlRequest.input(key, params[key]);
    });

    const result = await sqlRequest.query(query);

    //* Calcular totales
    const movimientos = result.recordset;
    const ultimoMovimiento = movimientos[0];
    const totalMovimientos = movimientos.length;

    return NextResponse.json({
      success: true,
      data: {
        saldoActual: ultimoMovimiento?.SaldoFinal || 0,
        importeTotal: ultimoMovimiento?.ImporteTotal || 0,
        totalMovimientos,
        movimientos,
      },
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener historial' },
      { status: 500 }
    );
  }
}