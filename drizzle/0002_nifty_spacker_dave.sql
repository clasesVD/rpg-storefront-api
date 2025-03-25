ALTER TABLE "product" DROP CONSTRAINT "product_item_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "price" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;