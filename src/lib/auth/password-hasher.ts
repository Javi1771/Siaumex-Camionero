import crypto from 'crypto';

/**
 * ASP.NET Core Identity Password Hasher V2 y V3
 * Verifica contraseñas hasheadas por ASP.NET Identity
 */
export class AspNetPasswordHasher {
  /**
   * Verifica si una contraseña coincide con el hash de ASP.NET Identity
   * @param hashedPassword - Password hash desde la base de datos
   * @param providedPassword - Password en texto plano proporcionado por el usuario
   * @returns boolean - true si la contraseña es correcta
   */
  static verify(hashedPassword: string, providedPassword: string): boolean {
    try {
      // Decodificar el hash de Base64
      const decodedHash = Buffer.from(hashedPassword, 'base64');

      // Versión del formato (byte 0)
      const version = decodedHash[0];

      console.log('Hash version detectada:', version);
      console.log('Hash length:', decodedHash.length);

      if (version === 0x00) {
        // ASP.NET Identity V2 format
        return this.verifyV2(decodedHash, providedPassword);
      } else if (version === 0x01) {
        // ASP.NET Identity V3 format
        return this.verifyV3(decodedHash, providedPassword);
      } else {
        console.error('Versión de hash no soportada:', version);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar contraseña:', error);
      return false;
    }
  }

  /**
   * Verifica password hash V2
   */
  private static verifyV2(decodedHash: Buffer, providedPassword: string): boolean {
    try {
      // V2 Format: 0x00 (version) + salt (16 bytes) + subkey (32 bytes) = 49 bytes total
      const salt = decodedHash.slice(1, 17); // 16 bytes de salt
      const subkey = decodedHash.slice(17); // resto es el subkey

      console.log('V2 - Salt length:', salt.length);
      console.log('V2 - Subkey length:', subkey.length);

      // ASP.NET Identity V2 usa PBKDF2 con SHA1, 1000 iteraciones
      const hashedProvidedPassword = crypto.pbkdf2Sync(
        providedPassword,
        salt,
        1000, // V2 usa 1000 iteraciones
        subkey.length,
        'sha1' // V2 usa SHA1
      );

      // Comparar los hashes de forma segura
      return crypto.timingSafeEqual(subkey, hashedProvidedPassword);
    } catch (error) {
      console.error('Error en verificación V2:', error);
      return false;
    }
  }

  /**
   * Verifica password hash V3
   */
  private static verifyV3(decodedHash: Buffer, providedPassword: string): boolean {
    try {
      // V3 Format: [version:1][prf:4][iteration count:4][salt length:4][salt][subkey]
      const prf = decodedHash.readUInt32BE(1);
      const iterationCount = decodedHash.readUInt32BE(5);
      const saltLength = decodedHash.readUInt32BE(9);

      console.log('V3 - PRF:', prf);
      console.log('V3 - Iterations:', iterationCount);
      console.log('V3 - Salt length:', saltLength);

      const salt = decodedHash.slice(13, 13 + saltLength);
      const subkey = decodedHash.slice(13 + saltLength);

      // V3 usa PBKDF2 con SHA256
      const hashedProvidedPassword = crypto.pbkdf2Sync(
        providedPassword,
        salt,
        iterationCount,
        subkey.length,
        'sha256'
      );

      return crypto.timingSafeEqual(subkey, hashedProvidedPassword);
    } catch (error) {
      console.error('Error en verificación V3:', error);
      return false;
    }
  }

  /**
   * Obtiene información del hash (útil para debugging)
   */
  static getHashInfo(hashedPassword: string) {
    try {
      const decodedHash = Buffer.from(hashedPassword, 'base64');
      const version = decodedHash[0];

      if (version === 0x00) {
        return {
          version: 'V2',
          format: '0x00 + salt(16) + subkey(32)',
          algorithm: 'PBKDF2-SHA1',
          iterations: 1000,
          totalLength: decodedHash.length,
        };
      } else if (version === 0x01) {
        const iterationCount = decodedHash.readUInt32BE(5);
        const saltLength = decodedHash.readUInt32BE(9);
        return {
          version: 'V3',
          format: 'version + prf + iterations + saltLength + salt + subkey',
          algorithm: 'PBKDF2-SHA256',
          iterations: iterationCount,
          saltLength,
          totalLength: decodedHash.length,
        };
      }

      return { version: 'Unknown', totalLength: decodedHash.length };
    } catch (error) {
      return null;
    }
  }
}