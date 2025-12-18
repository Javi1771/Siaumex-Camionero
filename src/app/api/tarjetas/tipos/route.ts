import { NextResponse } from 'next/server';
import { getConnection } from '@/src/lib/db/connection';

export async function GET() {
  try {
    const pool = await getConnection();
    
    const result = await pool.request().query(`
      SELECT Id, Nombre, PrecioKG
      FROM [TipoTarjetas]
      ORDER BY Nombre
    `);

    return NextResponse.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error al obtener tipos de tarjetas:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener tipos de tarjetas' },
      { status: 500 }
    );
  }
}