import { NextResponse } from 'next/server';
import { getConnection } from '@/src/lib/db/connection';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const pool = await getConnection();
    
    const result = await pool
      .request()
      .input('search', `%${search}%`)
      .query(`
        SELECT RFC, Nombre, Vigencia
        FROM [Clientes]
        WHERE Nombre LIKE @search OR RFC LIKE @search
        ORDER BY Nombre
      `);

    return NextResponse.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}