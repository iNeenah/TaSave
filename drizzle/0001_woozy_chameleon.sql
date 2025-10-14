CREATE TYPE "public"."role" AS ENUM('user', 'contributor', 'admin');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'user' NOT NULL;