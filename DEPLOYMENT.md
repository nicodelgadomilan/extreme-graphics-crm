# 🚀 Guía Completa de Deployment

Esta guía te llevará paso a paso para hacer el deploy del sistema a producción usando Supabase + Vercel.

## 📋 Pre-requisitos

- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Cuenta en GitHub
- Node.js 18+ instalado localmente

---

## 1️⃣ Configurar Supabase

### Paso 1: Crear Proyecto en Supabase

1. Ve a [Supabase](https://supabase.com) y crea una cuenta
2. Haz clic en "New Project"
3. Completa:
   - **Name**: `extreme-graphics-crm` (o el que prefieras)
   - **Database Password**: Genera uno seguro (guárdalo!)
   - **Region**: Elige el más cercano (ej: `East US`)
4. Haz clic en "Create new project"
5. Espera 2-3 minutos mientras se crea

### Paso 2: Obtener Connection String

1. En tu proyecto de Supabase, ve a **Settings** (engranaje abajo a la izquierda)
2. Haz clic en **Database**
3. Busca la sección "Connection string"
4. Selecciona el modo **Transaction** (no Session)
5. Copia el connection string que se ve así:
   ```
   postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
6. Reemplaza `[YOUR-PASSWORD]` con la contraseña que generaste en el paso 1

### Paso 3: Permitir Conexiones

1. En Supabase, ve a **Settings** → **Database**
2. Desactiva "Connection Pooler" si tienes problemas de conexión
3. O agrega tu IP actual a la lista de permitidas

---

## 2️⃣ Preparar el Código Localmente

### Paso 1: Instalar Dependencias

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

Renombra `env.example.txt` a `.env.local`:

```bash
mv env.example.txt .env.local
```

Edita `.env.local` y agrega:

```env
DATABASE_URL=postgresql://postgres.xxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Paso 3: Generar y Aplicar Migraciones

```bash
# Generar archivos de migración
npm run db:generate

# Aplicar schema a la base de datos
npm run db:push
```

Esto creará todas las tablas necesarias en tu base de datos de Supabase.

### Paso 4: Verificar Localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y verifica que todo funcione.

---

## 3️⃣ Subir a GitHub

### Paso 1: Crear Repositorio

1. Ve a [GitHub](https://github.com/new)
2. Crea un nuevo repositorio (público o privado)
3. **NO** inicialices con README

### Paso 2: Subir Código

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Migración a Supabase"

# Agregar remote
git remote add origin https://github.com/tu-usuario/tu-repo.git

# Subir código
git push -u origin main
```

**⚠️ IMPORTANTE**: Asegúrate de que `.env.local` esté en tu `.gitignore` para no subir secretos.

---

## 4️⃣ Deploy en Vercel

### Opción A: Desde el Dashboard (Recomendado)

1. Ve a [Vercel](https://vercel.com) y logueate
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es Next.js

### Configurar Variables de Entorno en Vercel

En la sección "Environment Variables" agrega:

**Variable 1:**
- **Name**: `DATABASE_URL`
- **Value**: Tu connection string de Supabase
- **Environment**: Production, Preview, Development (marca todas)

**Variable 2:**
- **Name**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `https://tu-app.vercel.app` (lo obtendrás después del deploy)
- **Environment**: Production

5. Haz clic en **"Deploy"**

### Paso 5: Actualizar NEXT_PUBLIC_SITE_URL

1. Después del primer deploy, copia tu URL de Vercel (ej: `https://extreme-graphics-abc123.vercel.app`)
2. Ve a **Settings** → **Environment Variables**
3. Edita `NEXT_PUBLIC_SITE_URL` y pon tu URL real
4. Ve a **Deployments** y haz clic en los tres puntos → **Redeploy**

### Opción B: Desde la Terminal (CLI)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Seguir las instrucciones en pantalla
```

---

## 5️⃣ Verificación Post-Deploy

### Checklist de Verificación

- [ ] La landing page carga correctamente
- [ ] El formulario de registro funciona
- [ ] Puedes iniciar sesión
- [ ] El dashboard carga sin errores
- [ ] Puedes crear un nuevo lead desde el landing
- [ ] Los leads aparecen en el dashboard

### Si algo no funciona:

1. **Ver logs en Vercel**:
   - Ve a tu proyecto en Vercel
   - Haz clic en **"Deployments"**
   - Selecciona el deployment actual
   - Haz clic en **"Functions"** para ver logs

2. **Verificar variables de entorno**:
   - Settings → Environment Variables
   - Verifica que estén correctamente configuradas

3. **Regenerar deployment**:
   - Deployments → Three dots → Redeploy

---

## 6️⃣ Configuración Adicional (Opcional)

### Dominio Personalizado

1. En Vercel, ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

### Configurar Stripe (si usas pagos)

1. Agrega estas variables en Vercel:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

### Email Notifications

1. Configura un servicio SMTP (ej: SendGrid, Resend)
2. Agrega variables en Vercel:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=tu-api-key
   SMTP_FROM=noreply@tudominio.com
   ```

---

## 7️⃣ Mantenimiento

### Aplicar Cambios al Schema

Si modificas `src/db/schema.ts`:

```bash
# Local
npm run db:generate
npm run db:push

# El cambio se aplicará automáticamente en producción
# porque la DB es la misma (Supabase)
```

### Rollback de Deployment

En Vercel:
1. Ve a **Deployments**
2. Encuentra un deployment anterior que funcionaba
3. Click en los tres puntos → **"Promote to Production"**

### Backup de Base de Datos

En Supabase:
1. Ve a **Database** → **Backups**
2. Los backups automáticos se hacen diariamente
3. Puedes restaurar manualmente si es necesario

---

## 🆘 Troubleshooting Común

### Error: "Failed to connect to database"

**Solución**:
1. Verifica que `DATABASE_URL` esté correctamente configurado en Vercel
2. Asegúrate de usar el modo "Transaction", no "Session"
3. En Supabase, ve a Settings → Database y verifica que las conexiones estén permitidas

### Error: "Module not found"

**Solución**:
```bash
# Borrar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Hacer commit y push
git add .
git commit -m "Fix dependencies"
git push
```

### Error: "Environment variable missing"

**Solución**:
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que todas las variables estén configuradas
3. Asegúrate de que estén marcadas para "Production"
4. Redeploy el proyecto

### La página se ve rota o sin estilos

**Solución**:
1. Verifica que el build se haya completado exitosamente
2. Limpia la caché de Vercel: Settings → General → Clear Cache
3. Redeploy

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica la consola del navegador (F12)
3. Contacta al equipo de desarrollo

---

**¡Listo!** 🎉 Tu aplicación debería estar funcionando en producción.

