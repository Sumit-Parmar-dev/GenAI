require('dotenv').config();
const { Client } = require('pg');

async function main() {
    // Connect directly bypassing the Prisma pooler layer for DDL
    const client = new Client({
        connectionString: process.env.DIRECT_URL
    });

    try {
        await client.connect();
        console.log("Connected directly to Supabase.");

        // Force drop legacy columns to resolve null constraints
        const queries = [
            `ALTER TABLE "Lead" DROP COLUMN IF EXISTS "name" CASCADE;`,
            `ALTER TABLE "Lead" DROP COLUMN IF EXISTS "phone" CASCADE;`,
            `ALTER TABLE "Lead" DROP COLUMN IF EXISTS "jobRole" CASCADE;`,
            `ALTER TABLE "Lead" DROP COLUMN IF EXISTS "companySize" CASCADE;`,
            `ALTER TABLE "Lead" DROP COLUMN IF EXISTS "budgetRange" CASCADE;`,
            `ALTER TABLE "Lead" DROP COLUMN IF EXISTS "deadline" CASCADE;`,
            `ALTER TABLE "Lead" DROP COLUMN IF EXISTS "country" CASCADE;`,
            // Also ensure the new columns exist just in case Prisma skipped
            `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "domain" TEXT;`,
            `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "projectUrl" TEXT;`,
            `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "baseSignal" INTEGER;`
        ];

        for (const q of queries) {
            console.log(`Executing: ${q}`);
            await client.query(q);
        }
        console.log("DDL Updates Successful.");
    } catch (e) {
        console.error("Error executing DDL:", e);
    } finally {
        await client.end();
    }
}

main();
