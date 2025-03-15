CREATE TABLE "category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"image" varchar(255) NOT NULL,
	CONSTRAINT "item_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "item_to_category" (
	"item_id" uuid NOT NULL,
	"category_id" uuid,
	CONSTRAINT "item_to_category_item_id_category_id_pk" PRIMARY KEY("item_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"rarity_id" uuid NOT NULL,
	"price" numeric(10, 2) DEFAULT '0.00',
	CONSTRAINT "product_item_id_rarity_id_unique" UNIQUE("item_id","rarity_id")
);
--> statement-breakpoint
CREATE TABLE "rarity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"color" varchar(255) NOT NULL,
	CONSTRAINT "rarity_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"balance" numeric(10, 2) DEFAULT '0.00',
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "item_to_category" ADD CONSTRAINT "item_to_category_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_to_category" ADD CONSTRAINT "item_to_category_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_rarity_id_rarity_id_fk" FOREIGN KEY ("rarity_id") REFERENCES "public"."rarity"("id") ON DELETE no action ON UPDATE no action;