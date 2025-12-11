CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"name" varchar NOT NULL,
	"avatar_url" varchar(512),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
