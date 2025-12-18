# SIAUMEX Camionero

Sistema de gestión de tarjetas para camioneros con diseño inspirado en Apple.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Protección de rutas con Middleware
- ✅ Modo claro/oscuro estilo Apple
- ✅ Diseño minimalista y moderno
- ✅ Conexión a SQL Server (ASP.NET Identity)
- ✅ Verificación de contraseñas ASP.NET Core Identity
- ✅ Layout responsivo con Tailwind CSS

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Acceso a la base de datos SQL Server

## 🛠️ Instalación

1. **Navegar al directorio del proyecto:**
   ```bash
   cd "D:\Proyectos personales\siaumex-camionero"
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   
   Crear archivo `.env.local` en la raíz del proyecto:
   ```env
   # Database Configuration
   DB_SERVER=SQL8020.site4now.net
   DB_NAME=db_aad297_yvasaa
   DB_USER=db_aad297_yvasaa_admin
   DB_PASSWORD=5EZzubi4j0vf

   # JWT Configuration
   JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion_minimo_32_caracteres
   JWT_EXPIRES_IN=7d

   # App Configuration
   NEXT_PUBLIC_APP_NAME=SIAUMEX Camionero
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 🔐 Credenciales de Prueba

Las credenciales se encuentran en la tabla `AspNetUsers`:
- **Usuario/Email:** Buscar en columna `NormalizedUserName` o `NormalizedEmail`
- **Contraseña:** Almacenada en `PasswordHash` (cifrado ASP.NET Identity)

Ejemplo de contraseña en texto plano: `Rellenos@2023`

## 📁 Estructura del Proyecto

```
siaumex-camionero/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Página de login
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx            # Layout con sidebar
│   │   │   ├── page.tsx              # Dashboard principal
│   │   │   └── tarjetas/             # Módulo de tarjetas (próximo)
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── login/route.ts    # API login
│   │   │       ├── logout/route.ts   # API logout
│   │   │       └── verify/route.ts   # Verificar sesión
│   │   ├── layout.tsx                # Layout raíz
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   └── theme-toggle.tsx      # Botón cambiar tema
│   │   └── providers/
│   │       └── theme-provider.tsx    # Provider de tema
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── password-hasher.ts    # Verificar passwords ASP.NET
│   │   │   └── jwt.ts                # Utilidades JWT
│   │   └── db/
│   │       └── connection.ts         # Conexión SQL Server
│   ├── types/
│   │   └── auth.ts                   # Types de autenticación
│   └── styles/
│       └── globals.css               # Estilos globales
├── middleware.ts                      # Middleware de protección
├── tailwind.config.ts                 # Config Tailwind
├── .env.local                         # Variables de entorno
└── package.json
```

## 🎨 Características del Diseño

### Modo Claro/Oscuro
- Cambio automático según preferencias del sistema
- Botón manual en el sidebar
- Transiciones suaves estilo Apple

### Diseño Glassmorphism
- Cards con efecto de vidrio
- Blur backdrop
- Sombras suaves
- Bordes sutiles

### Animaciones
- Fade in para elementos
- Slide in para modales
- Scale in para alertas
- Transiciones suaves en todos los elementos

## 🔒 Seguridad

- **JWT Tokens:** Almacenados en cookies httpOnly
- **Middleware:** Protección de rutas automática
- **Password Hashing:** Compatible con ASP.NET Core Identity V3
- **SQL Injection Protection:** Uso de prepared statements

## 🚧 Próximos Pasos

1. Implementar módulo de tarjetas
2. CRUD completo de tarjetas
3. Historial de movimientos
4. Dashboard con estadísticas
5. Exportación de reportes

## 📝 Notas Técnicas

### Verificación de Contraseñas ASP.NET Identity
El sistema usa PBKDF2 con SHA256 para verificar las contraseñas almacenadas en ASP.NET Identity V3:
- Version: 0x01
- Iteraciones: Variable (extraído del hash)
- Salt: Variable (extraído del hash)
- Algoritmo: PBKDF2-HMAC-SHA256

### Conexión a SQL Server
- Pool de conexiones configurado
- Manejo automático de errores
- Cierre de conexión al terminar proceso

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verificar credenciales en `.env.local`
- Verificar que el servidor SQL Server esté accesible
- Verificar firewall y permisos de red

### Token inválido
- Verificar que `JWT_SECRET` esté configurado
- Limpiar cookies del navegador
- Verificar que el token no haya expirado

## 📄 Licencia

Privado - SIAUMEX © 2024
