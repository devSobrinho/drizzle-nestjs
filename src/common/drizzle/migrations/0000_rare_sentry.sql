DO $$ BEGIN
 CREATE TYPE "main"."status" AS ENUM('a', 'd', 'b', 'p');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('a', 'd', 'p');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "payment_method" AS ENUM('a', 'd', 'b', 'p');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main"."permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main"."role_permissions" (
	"role_id" uuid,
	"permission_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main"."role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"status" "main"."status" NOT NULL,
	"tenant_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main"."tenant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"cep" varchar(256),
	"address" varchar(256),
	"number" integer,
	"city" varchar(256),
	"state" varchar(256),
	"country" varchar(256),
	"phone" varchar(256),
	"email" varchar(256) NOT NULL,
	"cnpj" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main"."user_roles" (
	"user_id" uuid,
	"role_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main"."user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"status" "main"."status" NOT NULL,
	"tenant_id" uuid,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category_product" (
	"category_id" uuid NOT NULL,
	"product_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_favorite_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"default" boolean NOT NULL,
	"number" varchar(256) NOT NULL,
	"complement" varchar(256),
	"address_id" uuid,
	"customer_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"phone" varchar(256) NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_quantity" integer NOT NULL,
	"product_id" uuid NOT NULL,
	"warehouse_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_date" timestamp NOT NULL,
	"status" "status" NOT NULL,
	"total_amount" numeric NOT NULL,
	"number" varchar(256) NOT NULL,
	"complement" varchar(256),
	"address_id" uuid,
	"customer_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_date" timestamp NOT NULL,
	"amount" numeric NOT NULL,
	"status" "status" NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"order_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"price" numeric NOT NULL,
	"stock_quantity" integer NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "warehouse" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"location" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "main"."role_permissions" ADD CONSTRAINT "role_permissions_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "main"."role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "main"."role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "main"."permission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "main"."role" ADD CONSTRAINT "role_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "main"."tenant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "main"."user_roles" ADD CONSTRAINT "user_roles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "main"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "main"."user_roles" ADD CONSTRAINT "user_roles_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "main"."role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "main"."user" ADD CONSTRAINT "user_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "main"."tenant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_product" ADD CONSTRAINT "category_product_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_product" ADD CONSTRAINT "category_product_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_favorite_addresses" ADD CONSTRAINT "customer_favorite_addresses_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_favorite_addresses" ADD CONSTRAINT "customer_favorite_addresses_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer" ADD CONSTRAINT "customer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "main"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
