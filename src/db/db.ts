import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';

// Setup utilizing node-postgres adapter and create db connector
// @ts-ignore
export const db = drizzle(process.env.DB_URL!)