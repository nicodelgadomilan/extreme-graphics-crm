# ✅ Checklist de Deployment

Usa esta lista para verificar que todo esté listo antes y después del deployment.

## 🔧 Pre-Deployment

### Configuración de Supabase
- [ ] Crear cuenta en Supabase
- [ ] Crear nuevo proyecto
- [ ] Guardar contraseña de la base de datos
- [ ] Copiar connection string (modo Transaction)
- [ ] Verificar que el proyecto esté activo

### Configuración Local
- [ ] Renombrar `env.example.txt` a `.env.local`
- [ ] Configurar `DATABASE_URL` en `.env.local`
- [ ] Configurar `NEXT_PUBLIC_SITE_URL` en `.env.local`
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `npm run db:generate`
- [ ] Ejecutar `npm run db:push`
- [ ] Ejecutar `npm run dev` y verificar que funcione

### Preparación del Código
- [ ] Todo el código está commiteado
- [ ] `.env.local` está en `.gitignore`
- [ ] No hay errores de TypeScript (`npm run build` exitoso)
- [ ] Push a GitHub completado

---

## 🚀 Deployment en Vercel

### Configuración Inicial
- [ ] Crear cuenta en Vercel
- [ ] Conectar con GitHub
- [ ] Importar repositorio correcto
- [ ] Vercel detecta Next.js automáticamente

### Variables de Entorno en Vercel
- [ ] Agregar `DATABASE_URL` (mismo de Supabase)
- [ ] Agregar `NEXT_PUBLIC_SITE_URL` (temporal: `https://your-app.vercel.app`)
- [ ] Marcar variables para Production, Preview, y Development
- [ ] Iniciar deployment

### Post-Deployment
- [ ] El deployment se completó exitosamente (status: Ready)
- [ ] Copiar URL de producción de Vercel
- [ ] Actualizar `NEXT_PUBLIC_SITE_URL` con URL real
- [ ] Hacer Redeploy con la variable actualizada

---

## ✅ Verificación Post-Deploy

### Funcionalidad Básica
- [ ] Landing page carga sin errores
- [ ] Imágenes y assets se cargan correctamente
- [ ] El selector de idioma funciona (ES/EN)
- [ ] Los botones de CTA funcionan
- [ ] WhatsApp link funciona

### Formularios y Lead Generation
- [ ] Wizard de cotización se abre
- [ ] Formulario de contacto funciona
- [ ] Se pueden crear leads desde el landing
- [ ] Chat AI (Nico) se abre correctamente

### Autenticación
- [ ] Página de login carga (`/login`)
- [ ] Página de registro carga (`/register`)
- [ ] Se puede crear una cuenta nueva
- [ ] Se puede iniciar sesión
- [ ] El token se guarda correctamente

### Dashboard (requiere login)
- [ ] Dashboard principal carga (`/dashboard`)
- [ ] Estadísticas se muestran correctamente
- [ ] Página de Tickets funciona (`/dashboard/tickets`)
- [ ] Página de Agenda funciona (`/dashboard/agenda`)
- [ ] Se pueden ver detalles de leads
- [ ] Logout funciona correctamente

### Base de Datos
- [ ] Los leads se guardan en Supabase
- [ ] Se pueden ver en Drizzle Studio
- [ ] Las relaciones entre tablas funcionan
- [ ] Los timestamps se registran correctamente

---

## 🔍 Verificación de Performance

- [ ] Lighthouse Score > 90 (Performance)
- [ ] Lighthouse Score > 90 (Accessibility)
- [ ] Lighthouse Score > 90 (Best Practices)
- [ ] Lighthouse Score > 90 (SEO)
- [ ] Tiempo de carga < 3 segundos
- [ ] No hay errores en la consola del navegador

---

## 📱 Testing en Dispositivos

- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari
- [ ] Mobile iOS Safari
- [ ] Mobile Android Chrome
- [ ] Tablet responsive

---

## 🔐 Seguridad

- [ ] Variables de entorno no están expuestas
- [ ] `.env` no está en GitHub
- [ ] Rutas protegidas requieren autenticación
- [ ] Tokens expiran correctamente
- [ ] No hay console.logs con información sensible

---

## 📊 Monitoreo Post-Launch

### Primera Semana
- [ ] Verificar logs de Vercel diariamente
- [ ] Monitorear errores en producción
- [ ] Revisar métricas de Supabase
- [ ] Verificar tasa de conversión de leads
- [ ] Solicitar feedback de usuarios

### Configuraciones Opcionales
- [ ] Configurar dominio personalizado
- [ ] Configurar SSL/HTTPS (automático en Vercel)
- [ ] Configurar Analytics (Google Analytics)
- [ ] Configurar error tracking (Sentry)
- [ ] Configurar email notifications
- [ ] Configurar Stripe (si se usan pagos)

---

## 🆘 Plan de Contingencia

### Si algo falla en producción:
1. [ ] Revisar logs de Vercel
2. [ ] Revisar console del navegador (F12)
3. [ ] Verificar variables de entorno
4. [ ] Verificar conexión a Supabase
5. [ ] Rollback al deployment anterior si es necesario

### Contactos de Emergencia
- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support
- **Documentación Drizzle**: https://orm.drizzle.team/docs/overview

---

## 🎉 Celebrar el Éxito

- [ ] El sitio está LIVE y funcionando
- [ ] Compartir URL con el equipo
- [ ] Actualizar documentación interna
- [ ] Tomar screenshot para el portafolio
- [ ] Celebrar con el equipo 🥳

---

**Última revisión**: [Fecha]  
**Revisado por**: [Nombre]  
**Status**: [ ] Todo OK | [ ] Revisar | [ ] Problemas detectados

