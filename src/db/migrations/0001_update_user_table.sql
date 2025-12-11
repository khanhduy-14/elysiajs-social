CREATE UNIQUE INDEX "user_public_id_idx" ON "user" USING btree ("public_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");