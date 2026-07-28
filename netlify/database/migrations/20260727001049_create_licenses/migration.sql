CREATE TABLE "licenses" (
	"id" text PRIMARY KEY DEFAULT (gen_random_uuid()::text),
	"owner_email" text,
	"plan" text DEFAULT 'free' NOT NULL,
	"credits" integer DEFAULT 100 NOT NULL,
	"device_status" text DEFAULT 'livre' NOT NULL,
	"status" text DEFAULT 'ativa' NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
