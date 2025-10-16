# 🚀 Próximos Pasos - Deployment a Supabase + Vercel

## ✅ Cambios Completados

### 1. **Migración de Base de Datos**
- ✅ Convertido de Turso (SQLite) a Supabase (PostgreSQL)
- ✅ Schema actualizado con tipos PostgreSQL
- ✅ Conexión configurada con `drizzle-orm/postgres-js`

### 2. **Configuración de Dependencias**
- ✅ Agregado `@supabase/supabase-js`
- ✅ Agregado `postgres` driver
- ✅ Removido `@libsql/client` (ya no necesario)
- ✅ Scripts de DB agregados al `package.json`

### 3. **Archivos de Configuración**
- ✅ `drizzle.config.ts` actualizado para PostgreSQL
- ✅ `vercel.json` creado
- ✅ `env.example.txt` creado con variables necesarias

### 4. **Documentación**
- ✅ `README.md` completamente reescrito
- ✅ `DEPLOYMENT.md` con guía paso a paso
- ✅ `DEPLOYMENT-CHECKLIST.md` para verificación

---

## 📝 Lo Que Necesitas Hacer AHORA

### Paso 1: Instalar Nuevas Dependencias

```bash
npm install
```

Esto instalará las nuevas dependencias de PostgreSQL.

### Paso 2: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta (si no tienes)
3. Click en "New Project"
4. Completa:
   - **Name**: `extreme-graphics-crm`
   - **Database Password**: Genera uno seguro (¡guárdalo!)
   - **Region**: `East US (North Virginia)` (más cercano a Miami)
5. Espera 2-3 minutos

### Paso 3: Configurar Variables de Entorno

Renombra `env.example.txt` a `.env.local`:

```bash
mv env.example.txt .env.local
```

Edita `.env.local` y pega tu connection string de Supabase:

```env
DATABASE_URL=postgresql://postgres.xxxx:[TU-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Obtener el connection string:**
1. En Supabase → Settings → Database
2. Sección "Connection string"
3. Selecciona modo **"Transaction"** (importante!)
4. Copia el string y reemplaza `[YOUR-PASSWORD]`

### Paso 4: Crear las Tablas en Supabase

```bash
# Generar archivos de migración
npm run db:generate

# Aplicar el schema a tu base de datos
npm run db:push
```

Esto creará todas las 13 tablas necesarias en Supabase.

### Paso 5: Probar Localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

**Verifica que:**
- La landing page cargue
- Puedas registrarte/login
- El dashboard funcione

### Paso 6: Subir a GitHub

```bash
# Agregar cambios
git add .

# Commit
git commit -m "Migración a Supabase PostgreSQL"

# Push
git push origin main
```

### Paso 7: Deploy en Vercel

**Opción A - Dashboard (más fácil):**

1. Ve a [https://vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Importa tu repositorio de GitHub
4. En "Environment Variables" agrega:
   - `DATABASE_URL`: Tu connection string de Supabase
   - `NEXT_PUBLIC_SITE_URL`: `https://tu-app.vercel.app`
5. Click "Deploy"
6. Espera 2-3 minutos

**Opción B - CLI:**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Paso 8: Actualizar NEXT_PUBLIC_SITE_URL

Después del primer deploy:

1. Copia tu URL de Vercel (ej: `https://extreme-graphics-abc123.vercel.app`)
2. En Vercel → Settings → Environment Variables
3. Edita `NEXT_PUBLIC_SITE_URL` con tu URL real
4. Deployments → Redeploy

---

## 📚 Documentación Disponible

Lee estos archivos para más detalles:

- **`README.md`**: Guía completa del proyecto
- **`DEPLOYMENT.md`**: Instrucciones detalladas de deployment
- **`DEPLOYMENT-CHECKLIST.md`**: Lista de verificación

---

## 🎯 Verificación Rápida Post-Deploy

Una vez deployado, verifica:

- [ ] Landing page carga
- [ ] Puedes crear una cuenta
- [ ] Puedes iniciar sesión
- [ ] Dashboard muestra estadísticas
- [ ] Puedes crear un lead desde el landing
- [ ] El lead aparece en el dashboard

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Iniciar servidor local

# Base de Datos
npm run db:generate        # Generar migraciones
npm run db:push           # Aplicar cambios a DB
npm run db:studio         # Ver datos en UI

# Build
npm run build             # Build de producción
npm run start             # Servidor de producción

# Deploy
vercel --prod            # Deploy a producción
```

---

## 🆘 Si Algo Sale Mal

### Error: "Failed to connect to database"
- Verifica que el `DATABASE_URL` esté correcto
- Asegúrate de usar modo "Transaction" en Supabase
- Verifica que tu IP esté permitida en Supabase

### Error: "Module not found: postgres"
```bash
rm -rf node_modules package-lock.json
npm install
```

### El deploy falla en Vercel
1. Revisa los logs en Vercel → Deployments → View Function Logs
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que el build local funcione: `npm run build`

---

## 📞 Recursos de Ayuda

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Drizzle Docs**: https://orm.drizzle.team/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 🎉 ¡Eso es Todo!

Una vez que completes estos pasos, tu aplicación estará funcionando en producción con:

✅ Base de datos PostgreSQL en Supabase  
✅ Frontend y API en Vercel  
✅ SSL/HTTPS automático  
✅ Escalabilidad automática  
✅ Backups diarios en Supabase  

**¡Buena suerte con el deployment!** 🚀

