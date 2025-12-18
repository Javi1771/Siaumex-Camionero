import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/src/lib/db/connection';
import { generateToken } from '@/src/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    const normalizedUsername = username.toUpperCase();

    const result = await pool
      .request()
      .input('username', normalizedUsername)
      .query(`
        SELECT 
          Id,
          UserName,
          NormalizedUserName,
          Email,
          NormalizedEmail,
          PlainPassword,
          AccessFailedCount,
          LockoutEnd
        FROM [db_aad297_yvasaa].[dbo].[AspNetUsers]
        WHERE NormalizedUserName = @username OR NormalizedEmail = @username
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const user = result.recordset[0];

    // Verificar lockout
    if (user.LockoutEnd && new Date(user.LockoutEnd) > new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cuenta bloqueada. Intente más tarde.',
        },
        { status: 403 }
      );
    }

    // Comparar contraseña directamente
    if (user.PlainPassword !== password) {
      // Incrementar intentos fallidos
      const newFailedCount = user.AccessFailedCount + 1;
      await pool
        .request()
        .input('userId', user.Id)
        .input('failedCount', newFailedCount)
        .query(`
          UPDATE [db_aad297_yvasaa].[dbo].[AspNetUsers]
          SET AccessFailedCount = @failedCount
          WHERE Id = @userId
        `);

      return NextResponse.json(
        { success: false, error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Reset intentos fallidos en login exitoso
    await pool
      .request()
      .input('userId', user.Id)
      .query(`
        UPDATE [db_aad297_yvasaa].[dbo].[AspNetUsers]
        SET AccessFailedCount = 0
        WHERE Id = @userId
      `);

    // Generar token JWT
    const token = await generateToken({
      userId: user.Id,
      username: user.UserName,
      email: user.Email || '',
    });

    const response = NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.Id,
        username: user.UserName,
        email: user.Email,
      },
    });

    // Establecer cookies
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    // NUEVA COOKIE: Guardar userId
    response.cookies.set('user-id', user.Id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}