# Extreme Graphics Sales System - CRM

Sistema completo de gestión de ventas y CRM para Extreme Graphics, una empresa de diseño gráfico y fabricación de letreros personalizados en Miami, FL.

## 🚀 Características

- **Landing Page Pública**: Página de inicio con wizard de cotización y chat AI
- **Sistema CRM Completo**: Dashboard, gestión de leads, tickets, cotizaciones
- **Autenticación**: Sistema seguro con Better-auth y bearer tokens
- **Base de Datos**: PostgreSQL con Drizzle ORM
- **Sistema Bilingüe**: Español e Inglés
- **Responsive Design**: UI moderna con Tailwind CSS y Radix UI
- **Gestión de Archivos**: Upload y almacenamiento de archivos
- **Generación de PDF**: Cotizaciones automáticas en PDF

## 📋 Tech Stack

- **Framework**: Next.js 15 (App Router con Turbopack)
- **Runtime**: React 19 con TypeScript
- **Base de Datos**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Autenticación**: Better-auth
- **Estilos**: Tailwind CSS 4 + Radix UI
- **Animaciones**: Framer Motion

## 🛠️ Setup Local

### 1. Clonar el repositorio

```bash
git clone <your-repo-url>
cd Extreme-Graphics-Sales-System-codebase
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Renombra `env.example.txt` a `.env.local` y configura las siguientes variables:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Obtener DATABASE_URL de Supabase:**
1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Settings → Database → Connection string
3. Usa "Transaction" mode para Vercel/Edge Functions

### 4. Generar y aplicar migraciones

```bash
# Generar migraciones desde el schema
npm run db:generate

# Aplicar migraciones a la base de datos
npm run db:push
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🗄️ Comandos de Base de Datos

```bash
# Generar migraciones desde schema.ts
npm run db:generate

# Aplicar cambios a la base de datos
npm run db:push

# Ejecutar migraciones
npm run db:migrate

# Abrir Drizzle Studio (UI para visualizar datos)
npm run db:studio
```

## 🌐 Deploy a Vercel

### 1. Conectar con GitHub

1. Sube tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Importa tu repositorio

### 2. Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXT_PUBLIC_SITE_URL = https://tu-dominio.vercel.app
```

### 3. Deploy

```bash
# Vercel detectará automáticamente Next.js y hará el deploy
# O usa el CLI:
npm install -g vercel
vercel --prod
```

## 📦 Estructura del Proyecto

```
├── src/
│   ├── app/              # Rutas de Next.js App Router
│   │   ├── api/          # API Routes (backend)
│   │   ├── dashboard/    # Dashboard CRM (protegido)
│   │   └── page.tsx      # Landing page pública
│   ├── components/       # Componentes React
│   │   ├── landing/      # Componentes del landing
│   │   └── ui/           # Componentes UI reutilizables
│   ├── contexts/         # React Contexts (Language, etc.)
│   ├── db/               # Base de datos
│   │   ├── schema.ts     # Schema de Drizzle
│   │   └── index.ts      # Conexión DB
│   └── lib/              # Utilidades y helpers
├── drizzle/              # Migraciones de base de datos
├── public/               # Archivos estáticos
└── drizzle.config.ts     # Configuración de Drizzle
```

## 🔐 Autenticación

El sistema usa **Better-auth** con bearer tokens:
- Los tokens se almacenan en localStorage
- El middleware protege las rutas `/dashboard/*`
- Sistema de roles: `admin` y `agent`

## 🗃️ Modelo de Datos

**Tablas principales:**
- `leads` - Clientes potenciales
- `estimates` - Cotizaciones con número único
- `products` - Catálogo de productos
- `quotes` - Cotizaciones de productos
- `orders` - Órdenes de compra
- `files` - Archivos adjuntos
- `chatSessions` - Sesiones de chat AI
- `user`, `session`, `account` - Autenticación

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run db:generate  # Generar migraciones
npm run db:push      # Aplicar cambios a DB
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Drizzle Studio UI
```

## 🚨 Troubleshooting

### Error de conexión a base de datos

Verifica que:
1. El `DATABASE_URL` esté correcto
2. Tu IP esté permitida en Supabase (o desactiva "Connection Pooler")
3. Uses "Transaction" mode, no "Session" mode

### Error en build

```bash
# Limpia caché y reinstala
rm -rf .next node_modules
npm install
npm run build
```

### Problemas con tipos de TypeScript

```bash
# Regenera tipos de Drizzle
npm run db:generate
```

## 📞 Contacto

**Extreme Graphics**
- WhatsApp: +1 (786) 288-1850
- Email: nicoextremegraphics@gmail.com
- Ubicación: Miami, FL

---

Desarrollado con ❤️ para Extreme Graphics
