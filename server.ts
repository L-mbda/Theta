/*
    Theta Custom Server Implementation
    Derived from Next.JS Documentation at https://nextjs.org/docs/app/building-your-application/configuring/custom-server
*/

// Dotenv setup
import {config} from '@dotenvx/dotenvx'

// Config for dotenv
config();

// Imports for custom server
import { createServer } from "http";
import {parse} from "url"
import next from 'next'
import chalk from 'chalk'
import * as schedule from 'node-schedule';
import { drizzle } from 'drizzle-orm/node-postgres';
import { services } from '@/db/schema';

// Defining constants
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev})
const handle = app.getRequestHandler();
const db = drizzle(process.env.DB_URL!)

// Function to register task implementation 
async function registerTasks() {
    // Call databaseInformation
    let databaseInformation = await (await db).select().from(services);
    for (let iteration in databaseInformation) {
        const service = databaseInformation[iteration];
        console.log(service);
        // Create a recurrence rule and then schedule job
        // that way
        const rule = new schedule.RecurrenceRule();
        rule.second = service.heartbeatInterval;
        schedule.scheduleJob(rule, () => {
            console.log("Schedule now!")
        })
    }
}

// Handling routes
app.prepare().then(() => {
    createServer((req,res) => {
        const parsedUrl = parse(req.url!, true)
        handle(req,res,parsedUrl)
    }).listen(port, async () => {
        console.log(`${chalk.blue("Theta")} ${chalk.magentaBright('CSI')}\n${chalk.cyanBright(`> Running on Port ${port} as ${
            dev ? 'development' : process.env.NODE_ENV
        }.`)}`)    
        // Register server cron functions
        console.log("Registering task implementation...");
        await registerTasks();

    })
})