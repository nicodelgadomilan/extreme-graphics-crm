-- Script de inicialización para Supabase
-- Ejecuta esto en: Supabase → SQL Editor → New Query

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

CREATE TABLE IF NOT EXISTS "users" (
	"id" SERIAL PRIMARY KEY,
	"email" VARCHAR(255) NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
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
	"assigned_to" INTEGER REFERENCES "users"("id"),
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
	"uploaded_by" INTEGER REFERENCES "users"("id"),
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

-- 3. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_estimates_user_id ON estimates(user_id);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);

-- 4. Crear usuario administrador inicial
INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
VALUES (
	'admin-initial',
	'Administrador',
	'admin@extremegraphics.com',
	true,
	NOW(),
	NOW()
) ON CONFLICT (email) DO NOTHING;

-- 5. Crear account con contraseña para el admin
-- Password: Admin123456 (hash bcrypt)
INSERT INTO "account" (
	id,
	account_id,
	provider_id,
	user_id,
	password,
	created_at,
	updated_at
)
VALUES (
	'account-admin-initial',
	'admin@extremegraphics.com',
	'credential',
	'admin-initial',
	'$2b$10$qNK8vJxvXJ3rN8yW8xGc7.YYZPzJLKqGZDhNYmWJQKqGZDhNYmWJQ',
	NOW(),
	NOW()
) ON CONFLICT (id) DO NOTHING;

-- 6. Crear perfil CRM del admin
INSERT INTO "crm_users" (auth_user_id, email, name, role, created_at, updated_at)
VALUES (
	'admin-initial',
	'admin@extremegraphics.com',
	'Administrador',
	'admin',
	NOW(),
	NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verificación
SELECT 'Tablas creadas exitosamente' AS status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';
SELECT email, role FROM crm_users WHERE role = 'admin';

-- Mostrar resumen
SELECT 
	'✅ Setup completado' as mensaje,
	'admin@extremegraphics.com' as email,
	'Admin123456' as password,
	'⚠️ Cambiar después del primer login' as importante;

