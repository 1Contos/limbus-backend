ALTER TABLE "licenses" ALTER COLUMN "id" SET DEFAULT (gen_random_uuid()::text);--> statement-breakpoint
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_plan_check" CHECK ("plan" in ('free', 'pro'));--> statement-breakpoint
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_credits_check" CHECK ("credits" >= 0);--> statement-breakpoint
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_device_status_check" CHECK ("device_status" in ('livre', 'vinculado'));--> statement-breakpoint
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_status_check" CHECK ("status" in ('ativa', 'banida'));