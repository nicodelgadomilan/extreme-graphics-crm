import { pgTable, serial, text, integer, boolean, timestamp, json, varchar } from 'drizzle-orm/pg-core';

// Add new CRM users table
export const crmUsers = pgTable('crm_users', {
	id: serial('id').primaryKey(),
	authUserId: text('auth_user_id').references(() => user.id).unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	name: varchar('name', { length: 255 }).notNull(),
	role: varchar('role', { length: 50 }).notNull().default('agent'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	password: text('password').notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	role: varchar('role', { length: 50 }).notNull().default('agent'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const leads = pgTable('leads', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 50 }),
	source: varchar('source', { length: 50 }).notNull(),
	status: varchar('status', { length: 50 }).notNull().default('new'),
	assignedTo: integer('assigned_to').references(() => users.id),
	notes: text('notes'),
	preferredContact: varchar('preferred_contact', { length: 50 }),
	ticketNumber: varchar('ticket_number', { length: 100 }),
	coverImage: text('cover_image'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const products = pgTable('products', {
	id: serial('id').primaryKey(),
	category: varchar('category', { length: 100 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	basePrice: integer('base_price').notNull(),
	descriptionEs: text('description_es'),
	descriptionEn: text('description_en'),
	imageUrl: text('image_url'),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const quotes = pgTable('quotes', {
	id: serial('id').primaryKey(),
	leadId: integer('lead_id').references(() => leads.id).notNull(),
	productId: integer('product_id').references(() => products.id).notNull(),
	quantity: integer('quantity').notNull().default(1),
	size: varchar('size', { length: 100 }),
	budgetRange: varchar('budget_range', { length: 100 }),
	artworkPreference: varchar('artwork_preference', { length: 100 }),
	estimatedPrice: integer('estimated_price').notNull(),
	status: varchar('status', { length: 50 }).notNull().default('draft'),
	validUntil: timestamp('valid_until'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const orders = pgTable('orders', {
	id: serial('id').primaryKey(),
	quoteId: integer('quote_id').references(() => quotes.id).notNull(),
	leadId: integer('lead_id').references(() => leads.id).notNull(),
	status: varchar('status', { length: 50 }).notNull().default('pending'),
	totalPrice: integer('total_price').notNull(),
	paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('pending'),
	deliveryDate: timestamp('delivery_date'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const chatSessions = pgTable('chat_sessions', {
	id: serial('id').primaryKey(),
	leadId: integer('lead_id').references(() => leads.id),
	messages: json('messages').notNull(),
	contextCaptured: json('context_captured'),
	status: varchar('status', { length: 50 }).notNull().default('active'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const files = pgTable('files', {
	id: serial('id').primaryKey(),
	leadId: integer('lead_id').references(() => leads.id),
	quoteId: integer('quote_id').references(() => quotes.id),
	orderId: integer('order_id').references(() => orders.id),
	filename: varchar('filename', { length: 255 }).notNull(),
	fileUrl: text('file_url').notNull(),
	fileType: varchar('file_type', { length: 100 }).notNull(),
	fileSize: integer('file_size').notNull(),
	uploadedBy: integer('uploaded_by').references(() => users.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const estimates = pgTable('estimates', {
	id: serial('id').primaryKey(),
	quoteNumber: varchar('quote_number', { length: 100 }).notNull().unique(),
	clientName: varchar('client_name', { length: 255 }).notNull(),
	clientEmail: varchar('client_email', { length: 255 }).notNull(),
	clientPhone: varchar('client_phone', { length: 50 }),
	clientAddress: text('client_address'),
	items: json('items').notNull(),
	subtotal: integer('subtotal').notNull(),
	taxRate: integer('tax_rate').default(0),
	taxAmount: integer('tax_amount').default(0),
	shippingCost: integer('shipping_cost').default(0),
	total: integer('total').notNull(),
	notes: text('notes'),
	validUntil: timestamp('valid_until'),
	status: varchar('status', { length: 50 }).notNull().default('draft'),
	userId: text('user_id').references(() => user.id),
	pdfFile: text('pdf_file'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Auth tables for better-auth
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified")
		.default(false)
		.notNull(),
	image: text("image"),
	createdAt: timestamp("created_at")
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});