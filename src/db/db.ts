import 'dotenv/config';
import {drizzle} from 'drizzle-orm/connect';

// Setup utilizing node-postgres adapter and create db connector
export const db = drizzle("node-postgres", {
    connection: {
        connectionString: process.env.DB_URL!,
        ssl: true,
    }
})