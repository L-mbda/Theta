/*
    Theta v1 Enterprise Tools
    ©2024 L-mbda. Licensed under the MPL-v2 license.
    Tool that wipes the database that Theta is connected to.
    [USE THIS WITH CAUTION]
*/

import { db } from "@/db/db";
import chalk from 'chalk'
import * as schema from '@/db/schema';
import { sql } from "drizzle-orm";

export async function wipeDatabase() {
    console.log(chalk.yellowBright("Wiping Database..."));

    // Fetch all table names from the 'public' schema
    const result = await db.execute<{ table_name: string }>(sql`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);

    // Loop 
    result.rows.forEach(async (table) => {
        await db.execute(sql.raw(`TRUNCATE TABLE "${table.table_name}" CASCADE;`));
        console.log(chalk.greenBright(`✅ Deleted table ${table.table_name}`));
    });

    // Confirmation message
    console.log(chalk.greenBright("✅ Database wiped!"));
}

// Wipe database
console.log(chalk.yellowBright("Theta v1 Enterprise Tools"));
console.log(chalk.redBright("⚠️  Using this tool constitutes your acceptance of the database being wiped."));
wipeDatabase()