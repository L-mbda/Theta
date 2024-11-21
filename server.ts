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
import { drizzle } from 'drizzle-orm/node-postgres';
import { services } from '@/db/schema';

// Scheduling and ping utilities
import * as ToadScheduler from 'toad-scheduler';
import * as ping from 'ping'

// Defining constants
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev})
const handle = app.getRequestHandler();
const db = drizzle(process.env.DB_URL!)
const scheduler = new ToadScheduler.ToadScheduler();

// Function to register task implementation 
async function registerTasks() {
    // Call databaseInformation
    let databaseInformation = await (await db).select().from(services);
    for (let iteration in databaseInformation) {
        const service = databaseInformation[iteration];
        console.log(service);
        // Create a task
        const task = new ToadScheduler.Task(service.id, () => {
            if (service.monitorType == "ping") {
                ping.sys.probe(service.monitorURL, (isAlive) => {
                    console.log(isAlive);
                })
            }
            console.log("Hello")
        })
        // Run the job and then have it occur several times
        const job = new ToadScheduler.SimpleIntervalJob({seconds: 5,},task)
        scheduler.addSimpleIntervalJob(job)
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
        await registerTasks();
    })
})

// Handle graceful exits
process.on('SIGTERM', async () => {
    await app.close();
    scheduler.stop();
    console.log(chalk.cyanBright("Stopped Theta Server. Have a good day!"))
    process.exit(0);
})

process.on('SIGINT', async () => {
    await app.close();
    scheduler.stop();
    console.log(chalk.cyanBright("Stopped Theta Server. Have a good day!"))
    process.exit(0);
})