# 🔧 Instrucciones: Crear Tablas y Usuario Admin en Supabase

## ⚡ PASO A PASO (2 minutos)

### 1. Ir al SQL Editor de Supabase

1. Abre tu proyecto en Supabase: https://supabase.com/dashboard/project/ykejgtfahzotqrlsobjx
2. En el menú lateral izquierdo, busca y haz clic en **"SQL Editor"** (ícono de base de datos)
3. Haz clic en **"+ New Query"**

### 2. Copiar y Pegar el SQL

Abre el archivo `supabase-setup.sql` que está en la raíz del proyecto y copia TODO su contenido.

O copia este SQL directamente:

```sql
-- Script de inicialización para Supabase

-- 1. Crear tablas de autenticación (Better Auth)
CREATE TABLE IF NOT EXISTS "user" (
	"id" TEXT PRIMARY KEY,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"email_verified" BOOLEAN DEFAULT false NOT NULL,
	"image" TEXT,
	"created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
	"updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
	"id" TEXT PRIMARY KEY,
	"expires_at" TIMESTAMP NOT NULL,
	"token" TEXT NOT NULL UNIQUE,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	"ip_address" TEXT,
	"user_agent" TEXT,
	"user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
	"id" TEXT PRIMARY KEY,
	"account_id" TEXT NOT NULL,
	"provider_id" TEXT NOT NULL,
	"user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"access_token" TEXT,
	"refresh_token" TEXT,
	"id_token" TEXT,
	"access_token_expires_at" TIMESTAMP,
	"refresh_token_expires_at" TIMESTAMP,
	"scope" TEXT,
	"password" TEXT,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
	"id" TEXT PRIMARY KEY,
	"identifier" TEXT NOT NULL,
	"value" TEXT NOT NULL,
	"expires_at" TIMESTAMP NOT NULL,
	"created_at" TIMESTAMP DEFAULT NOW(),
	"updated_at" TIMESTAMP DEFAULT NOW()
);

-- 2. Crear tablas del CRM
CREATE TABLE IF NOT EXISTS "crm_users" (
	"id" SERIAL PRIMARY KEY,
	"auth_user_id" TEXT UNIQUE REFERENCES "user"("id"),
	"email" VARCHAR(255) NOT NULL UNIQUE,
	"name" VARCHAR(255) NOT NULL,
	"role" VARCHAR(50) NOT NULL DEFAULT 'agent',
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "leads" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(255) NOT NULL,
	"email" VARCHAR(255) NOT NULL,
	"phone" VARCHAR(50),
	"source" VARCHAR(50) NOT NULL,
	"status" VARCHAR(50) NOT NULL DEFAULT 'new',
	"assigned_to" INTEGER,
	"notes" TEXT,
	"preferred_contact" VARCHAR(50),
	"ticket_number" VARCHAR(100),
	"cover_image" TEXT,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "products" (
	"id" SERIAL PRIMARY KEY,
	"category" VARCHAR(100) NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"base_price" INTEGER NOT NULL,
	"description_es" TEXT,
	"description_en" TEXT,
	"image_url" TEXT,
	"is_active" BOOLEAN DEFAULT true,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "quotes" (
	"id" SERIAL PRIMARY KEY,
	"lead_id" INTEGER NOT NULL REFERENCES "leads"("id"),
	"product_id" INTEGER NOT NULL REFERENCES "products"("id"),
	"quantity" INTEGER NOT NULL DEFAULT 1,
	"size" VARCHAR(100),
	"budget_range" VARCHAR(100),
	"artwork_preference" VARCHAR(100),
	"estimated_price" INTEGER NOT NULL,
	"status" VARCHAR(50) NOT NULL DEFAULT 'draft',
	"valid_until" TIMESTAMP,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "orders" (
	"id" SERIAL PRIMARY KEY,
	"quote_id" INTEGER NOT NULL REFERENCES "quotes"("id"),
	"lead_id" INTEGER NOT NULL REFERENCES "leads"("id"),
	"status" VARCHAR(50) NOT NULL DEFAULT 'pending',
	"total_price" INTEGER NOT NULL,
	"payment_status" VARCHAR(50) NOT NULL DEFAULT 'pending',
	"delivery_date" TIMESTAMP,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "chat_sessions" (
	"id" SERIAL PRIMARY KEY,
	"lead_id" INTEGER REFERENCES "leads"("id"),
	"messages" JSON NOT NULL,
	"context_captured" JSON,
	"status" VARCHAR(50) NOT NULL DEFAULT 'active',
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "files" (
	"id" SERIAL PRIMARY KEY,
	"lead_id" INTEGER REFERENCES "leads"("id"),
	"quote_id" INTEGER REFERENCES "quotes"("id"),
	"order_id" INTEGER REFERENCES "orders"("id"),
	"filename" VARCHAR(255) NOT NULL,
	"file_url" TEXT NOT NULL,
	"file_type" VARCHAR(100) NOT NULL,
	"file_size" INTEGER NOT NULL,
	"uploaded_by" INTEGER,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "estimates" (
	"id" SERIAL PRIMARY KEY,
	"quote_number" VARCHAR(100) NOT NULL UNIQUE,
	"client_name" VARCHAR(255) NOT NULL,
	"client_email" VARCHAR(255) NOT NULL,
	"client_phone" VARCHAR(50),
	"client_address" TEXT,
	"items" JSON NOT NULL,
	"subtotal" INTEGER NOT NULL,
	"tax_rate" INTEGER DEFAULT 0,
	"tax_amount" INTEGER DEFAULT 0,
	"shipping_cost" INTEGER DEFAULT 0,
	"total" INTEGER NOT NULL,
	"notes" TEXT,
	"valid_until" TIMESTAMP,
	"status" VARCHAR(50) NOT NULL DEFAULT 'draft',
	"user_id" TEXT REFERENCES "user"("id"),
	"pdf_file" TEXT,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Crear usuario administrador
INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
VALUES (
	'admin-initial',
	'Administrador',
	'admin@extremegraphics.com',
	true,
	NOW(),
	NOW()
) ON CONFLICT (email) DO NOTHING;

-- 4. Crear perfil CRM del admin
INSERT INTO "crm_users" (auth_user_id, email, name, role)
VALUES (
	'admin-initial',
	'admin@extremegraphics.com',
	'Administrador',
	'admin'
) ON CONFLICT (email) DO NOTHING;

-- Verificación
SELECT '✅ Setup completado' as status;
SELECT COUNT(*) as total_tablas FROM information_schema.tables WHERE table_schema = 'public';
SELECT email, role FROM crm_users;
```

### 3. Ejecutar el SQL

1. Pega todo el SQL en el editor
2. Haz clic en **"Run"** (o presiona Cmd/Ctrl + Enter)
3. Espera a que termine (verás "Success" en verde)

### 4. Verificar

Deberías ver:
- ✅ "Setup completado"
- ✅ 13 tablas creadas
- ✅ Usuario admin creado

---

## 🔑 Credenciales de Acceso

Una vez ejecutado el SQL, podrás ingresar con:

```
📧 Email:    admin@extremegraphics.com
🔑 Password: Admin123456
```

**⚠️ IMPORTANTE**: Cambia esta contraseña inmediatamente después del primer login.

---

## 🌐 URLs de tu Aplicación

**Producción**: https://extreme-graphics-exx4xd72v-nicodelgadomilan-1906s-projects.vercel.app

**Dashboard Vercel**: https://vercel.com/nicodelgadomilan-1906s-projects/extreme-graphics-crm

**Panel Supabase**: https://supabase.com/dashboard/project/ykejgtfahzotqrlsobjx

---

## ✅ Próximos Pasos

1. Ejecuta el SQL en Supabase (2 minutos)
2. Ve a tu sitio: https://extreme-graphics-exx4xd72v-nicodelgadomilan-1906s-projects.vercel.app/login
3. Inicia sesión con las credenciales de arriba
4. ¡Disfruta tu CRM! 🎉

