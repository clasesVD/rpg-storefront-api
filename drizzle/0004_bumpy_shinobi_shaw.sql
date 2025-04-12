CREATE TYPE "public"."user_role" AS ENUM('A', 'C');
ALTER TABLE "user" ADD COLUMN "role" "user_role" NOT NULL;
