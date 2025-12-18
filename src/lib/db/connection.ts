import sql from 'mssql';

const config: sql.config = {
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: true, // Para Azure/conexiones remotas
    trustServerCertificate: true, // Para desarrollo
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  try {
    if (pool) {
      return pool;
    }

    pool = await sql.connect(config);
    console.log('✅ Conectado a SQL Server');
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar a SQL Server:', error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('✅ Conexión cerrada');
    }
  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error);
  }
}

// Cerrar conexión al terminar el proceso
if (typeof process !== 'undefined') {
  process.on('SIGTERM', closeConnection);
  process.on('SIGINT', closeConnection);
}

export { sql };
