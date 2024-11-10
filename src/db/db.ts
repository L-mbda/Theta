import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';

// Setup utilizing node-postgres adapter and create db connector
export const db = drizzle({
    connection: {
        connectionString: process.env.DB_URL!,
        ssl: true,
    }
})