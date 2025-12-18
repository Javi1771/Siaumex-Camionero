import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/src/lib/db/connection';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      tarjetaId,
      saldoAExtraer,
      precioKG,
      clienteId,
    } = body;

    // Validaciones
    if (!tarjetaId || !saldoAExtraer || !clienteId) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Obtener userId de las cookies - AWAIT aquí
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value || 'SYSTEM';

    const pool = await getConnection();

    // Obtener el último saldo de la tarjeta
    const ultimoMovimiento = await pool
      .request()
      .input('tarjetaId', tarjetaId)
      .input('clienteId', clienteId)
      .query(`
        SELECT TOP 1 SaldoFinal
        FROM [TarjetaMovimientos]
        WHERE TarjetaOrigenDestinoId = @tarjetaId 
          AND ClienteId = @clienteId
        ORDER BY Fecha DESC
      `);

    // Si no hay movimientos previos, obtener saldo inicial de la tarjeta
    let saldoInicial = 0;
    if (ultimoMovimiento.recordset.length > 0) {
      saldoInicial = ultimoMovimiento.recordset[0].SaldoFinal;
    } else {
      const tarjeta = await pool
        .request()
        .input('tarjetaId', tarjetaId)
        .query(`
          SELECT Saldo FROM [Tarjetas] WHERE Id = @tarjetaId
        `);
      saldoInicial = tarjeta.recordset[0]?.Saldo || 0;
    }

    // Validar que haya saldo suficiente
    if (saldoAExtraer > saldoInicial) {
      return NextResponse.json(
        { success: false, error: 'Saldo insuficiente' },
        { status: 400 }
      );
    }

    // Calcular valores
    const saldoConsumido = saldoAExtraer;
    const saldoFinal = saldoInicial - saldoConsumido;
    const importeTotal = saldoConsumido * precioKG;
    const maximoEquivalente = saldoFinal * precioKG;

    // Obtener el siguiente Folio
    const maxFolioResult = await pool.request().query(`
      SELECT ISNULL(MAX(Folio), 0) + 1 AS NextFolio FROM [TarjetaMovimientos]
    `);
    const nextFolio = maxFolioResult.recordset[0].NextFolio;

    // Fecha actual
    const fechaActual = new Date().toISOString();

    // Insertar movimiento
    await pool
      .request()
      .input('Folio', nextFolio)
      .input('Id', tarjetaId)
      .input('TarjetaId', 1)
      .input('SaldoInicial', saldoInicial)
      .input('SaldoConsumido', saldoConsumido)
      .input('SaldoFinal', saldoFinal)
      .input('ImporteTotal', importeTotal)
      .input('MaximoEquivalente', maximoEquivalente)
      .input('Fecha', fechaActual)
      .input('ClienteId', clienteId)
      .input('TipoMovimiento', 'Consumo')
      .input('TarjetaOrigenDestinoId', tarjetaId)
      .input('TarjetaDestinoNombre', tarjetaId.toString())
      .input('CreateDate', fechaActual)
      .input('CreateBy', userId)
      .input('LastModifiedDate', fechaActual)
      .input('LastModifiedBy', userId)
      .query(`
        INSERT INTO [TarjetaMovimientos] (
          Folio, Id, TarjetaId, SaldoInicial, SaldoConsumido, SaldoFinal,
          ImporteTotal, MaximoEquivalente, Fecha, ClienteId, TipoMovimiento,
          TarjetaOrigenDestinoId, TarjetaDestinoNombre, CreateDate, CreateBy,
          LastModifiedDate, LastModifiedBy
        ) VALUES (
          @Folio, @Id, @TarjetaId, @SaldoInicial, @SaldoConsumido, @SaldoFinal,
          @ImporteTotal, @MaximoEquivalente, @Fecha, @ClienteId, @TipoMovimiento,
          @TarjetaOrigenDestinoId, @TarjetaDestinoNombre, @CreateDate, @CreateBy,
          @LastModifiedDate, @LastModifiedBy
        )
      `);

    // Actualizar saldo en la tabla Tarjetas
    await pool
      .request()
      .input('tarjetaId', tarjetaId)
      .input('nuevoSaldo', saldoFinal)
      .query(`
        UPDATE [Tarjetas]
        SET Saldo = @nuevoSaldo
        WHERE Id = @tarjetaId
      `);

    return NextResponse.json({
      success: true,
      message: 'Saldo extraído correctamente',
      data: { 
        folio: nextFolio,
        saldoFinal,
      },
    });
  } catch (error) {
    console.error('Error al extraer saldo:', error);
    return NextResponse.json(
      { success: false, error: 'Error al extraer saldo' },
      { status: 500 }
    );
  }
}