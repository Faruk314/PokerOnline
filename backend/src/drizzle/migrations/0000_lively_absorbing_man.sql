CREATE TABLE "users" (
	"userId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userName" text NOT NULL,
	"image" text,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"email" text NOT NULL,
	"coins" integer DEFAULT 10000 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "coinPackages" (
	"userId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" integer NOT NULL,
	"price" integer NOT NULL
);
