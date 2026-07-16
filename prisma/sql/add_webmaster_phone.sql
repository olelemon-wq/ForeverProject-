-- Add multi-phone support table (safe to run if already exists)
CREATE TABLE IF NOT EXISTS "WebmasterPhone" (
  "id" TEXT NOT NULL,
  "webmasterId" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WebmasterPhone_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "WebmasterPhone_phone_key" ON "WebmasterPhone"("phone");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'WebmasterPhone_webmasterId_fkey'
  ) THEN
    ALTER TABLE "WebmasterPhone"
      ADD CONSTRAINT "WebmasterPhone_webmasterId_fkey"
      FOREIGN KEY ("webmasterId") REFERENCES "Webmaster"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Backfill primary phones from legacy Webmaster.phone
INSERT INTO "WebmasterPhone" ("id", "webmasterId", "phone", "isPrimary", "createdAt")
SELECT gen_random_uuid()::text, w."id", w."phone", true, NOW()
FROM "Webmaster" w
WHERE w."phone" IS NOT NULL
  AND w."phone" <> ''
  AND NOT EXISTS (
    SELECT 1 FROM "WebmasterPhone" p WHERE p."phone" = w."phone"
  );
