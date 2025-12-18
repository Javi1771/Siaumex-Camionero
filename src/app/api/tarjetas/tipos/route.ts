import { NextResponse, NextRequest } from 'next/server';
import { getConnection } from '@/src/lib/db/connection';

export async function GET() {
  try {
    const pool = await getConnection();
    
    const result = await pool.request().query(`
      SELECT 
        Id, 
        Nombre, 
        Description, 
        PrecioKG, 
        Status, 
        CreateDate
      FROM [TipoTarjetas]
      ORDER BY Id ASC
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, description, precioKG } = body;

    if (!nombre || !precioKG) {
      return NextResponse.json(
        { success: false, error: 'Nombre y precio son requeridos' },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    //* Obtener el siguiente ID
    const maxIdResult = await pool.request().query(`
      SELECT ISNULL(MAX(Id), 0) + 1 AS NextId FROM [TipoTarjetas]
    `);
    const nextId = maxIdResult.recordset[0].NextId;

    //* Fecha actual
    const fechaActual = new Date().toISOString();

    //? Insertar nuevo tipo de tarjeta
    await pool
      .request()
      .input('Id', nextId)
      .input('Nombre', nombre)
      .input('Description', description || '')
      .input('PrecioKG', precioKG)
      .input('Status', 0)
      .input('CreateDate', fechaActual)
      .input('CreateBy', 'System')
      .query(`
        INSERT INTO [TipoTarjetas] (
          Id, Nombre, Description, PrecioKG, Status, CreateDate, CreateBy
        ) VALUES (
          @Id, @Nombre, @Description, @PrecioKG, @Status, @CreateDate, @CreateBy
        )
      `);

    return NextResponse.json({
      success: true,
      message: 'Tipo de tarjeta creado correctamente',
      data: { id: nextId },
    });
  } catch (error) {
    console.error('Error al crear tipo de tarjeta:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear tipo de tarjeta' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nombre, description, precioKG } = body;

    if (!id || !nombre || !precioKG) {
      return NextResponse.json(
        { success: false, error: 'ID, nombre y precio son requeridos' },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    //? Actualizar tipo de tarjeta
    await pool
      .request()
      .input('Id', id)
      .input('Nombre', nombre)
      .input('Description', description || '')
      .input('PrecioKG', precioKG)
      .query(`
        UPDATE [TipoTarjetas]
        SET 
          Nombre = @Nombre,
          Description = @Description,
          PrecioKG = @PrecioKG
        WHERE Id = @Id
      `);

    return NextResponse.json({
      success: true,
      message: 'Tipo de tarjeta actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar tipo de tarjeta:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar tipo de tarjeta' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID es requerido' },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    //? Cambiar status a 1 (inactivo)
    await pool
      .request()
      .input('Id', id)
      .query(`
        UPDATE [TipoTarjetas]
        SET Status = 1
        WHERE Id = @Id
      `);

    return NextResponse.json({
      success: true,
      message: 'Tipo de tarjeta inactivado correctamente',
    });
  } catch (error) {
    console.error('Error al inactivar tipo de tarjeta:', error);
    return NextResponse.json(
      { success: false, error: 'Error al inactivar tipo de tarjeta' },
      { status: 500 }
    );
  }
}