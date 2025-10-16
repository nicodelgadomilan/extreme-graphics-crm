# ⚡ Quick Start - 5 Minutos

## 1️⃣ Instalar (30 segundos)

```bash
npm install
```

## 2️⃣ Supabase (2 minutos)

1. Ir a [supabase.com](https://supabase.com)
2. Crear proyecto → Guardar password
3. Settings → Database → Connection string (modo **Transaction**)

## 3️⃣ Variables (1 minuto)

```bash
mv env.example.txt .env.local
```

Editar `.env.local`:
```env
DATABASE_URL=postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4️⃣ Crear Tablas (1 minuto)

```bash
npm run db:push
```

## 5️⃣ Probar Localmente (30 segundos)

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy a Vercel

1. Push a GitHub
2. Ir a [vercel.com](https://vercel.com)
3. Import Repository
4. Agregar variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL`
5. Deploy

**¡Listo en 5 minutos!** 🎉

---

Para más detalles ver: `PASOS-SIGUIENTES.md` o `DEPLOYMENT.md`

