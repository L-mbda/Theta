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
import { serviceHistory, services } from '@/db/schema';
import { ping } from 'tcp-ping';
import {Server} from "socket.io";
import axios from "axios";

// Scheduling and ping utilities
import * as ToadScheduler from 'toad-scheduler';

// Defining constants
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev})
const handle = app.getRequestHandler();
const db = drizzle(process.env.DB_URL!)
export const scheduler = new ToadScheduler.ToadScheduler();

// Function to register task implementation 
export async function registerTasks() {
    // Call databaseInformation
    let databaseInformation = await (await db).select().from(services);
    for (let iteration in databaseInformation) {
        const service = databaseInformation[iteration];
        // Variables for service errors
        let serviceErrorCount = 0;
        let serviceError = false;
        // Create a task
        const task = new ToadScheduler.Task(service.id,  async () => {
            // Raise errors if not reachable
            if (serviceErrorCount > service.maxRetries) {
                // If greater than maximum retries, add to service history of database not being reachable
                if (!serviceError) {
                    // Add to service history of database not being reachable
                    // @ts-ignore
                    await (await db).insert(serviceHistory).values({
                        'reachableStatus': false,
                        'serviceID': service.id,
                        'time': (new Date().getTime()).toString(),
                    })
                    // Log service not responding and stopping service
                    console.log(chalk.redBright(`❌ Service ${service.name} is not reachable! Stopped servicing.`))
                }
                // Stop notifications and pushing to service history by raising serviceError to true.
                serviceError = true;
            } else if (service.monitorType == "ping") {
                // Ping service
                ping({address: service.monitorURL}, async (err, data) => {
                    // Check if error and increment errors
                    if (err || data.max == undefined && data.min == undefined) {
                        serviceErrorCount++;
                    // If address is equal to the monitor url, insert into the service history of a record of the server being reachable
                    } else if (data.address == service.monitorURL) {
                        // @ts-ignore
                        await (await db).insert(serviceHistory).values({
                            'reachableStatus': true,
                            'serviceID': service.id,
                            'time': (new Date().getTime()).toString(),
                        })
                        // Log that the server is reachable                        
                        console.log(chalk.greenBright(`✅ Service ${service.name} is reachable!`))
                    }
                })
            } else if (service.monitorType == "http") {
                // Request the server with axios
                try {
                    // Fetch information and check if the URL starts with http or https
                    const fetchInfo = await axios.get((service.monitorURL.startsWith("http://") || service.monitorURL.startsWith("https://")) ? service.monitorURL : "http://" + service.monitorURL);
                    // If status is "SUCCESSFUL" as per HTTP terms, insert into the service history of being reachable, otherwise increment errors
                    if (fetchInfo.status >= 200 && fetchInfo.status < 300) {
                        // @ts-ignore
                        await (await db).insert(serviceHistory).values({
                            'reachableStatus': true,
                            'serviceID': service.id,
                            'time': (new Date().getTime()).toString(),
                        })
                        // Log server being reachable
                        console.log(chalk.greenBright(`✅ Service ${service.name} is reachable!`))
                    } else {
                        serviceErrorCount++;
                    }
                // If there is an axios error (most likely to occur), increment an error.
                } catch (error) {
                    serviceErrorCount++;
                }
            }
        })
        // Run the job and then have it occur several times
        const job = new ToadScheduler.SimpleIntervalJob({seconds: (service.heartbeatInterval > 0) ? service.heartbeatInterval : 1,},task)
        scheduler.addSimpleIntervalJob(job)
    }
}

// Check the database and reinject tasks
async function checkDatabase() {
    // Create the task and check databases
    let oldDatabaseInfo = (await (await db).select().from(services));
    const task = new ToadScheduler.Task("injectTask", async () => {
        // Obtain database information
        let databaseInformation = await (await db).select().from(services);
        // Create flag 
        let sameDatabaseValues = true;
        // Check if info is same
        for (let i in databaseInformation) {
            // Try statements to prevent out of bound errors
            try {
                // Comparing the name and other attributes to see if equal, if not, then set to false
                if (databaseInformation[i].name != oldDatabaseInfo[i].name || databaseInformation[i].monitorType != oldDatabaseInfo[i].monitorType || databaseInformation[i].monitorURL != oldDatabaseInfo[i].monitorURL || databaseInformation[i].heartbeatInterval != oldDatabaseInfo[i].heartbeatInterval || databaseInformation[i].maxRetries != oldDatabaseInfo[i].maxRetries) {
                    sameDatabaseValues = false;
                    break;
                }
            } catch (e) {
                break;
            }
        }
        // Check if the database length is different or if information changed
        if (databaseInformation.length != oldDatabaseInfo.length || !sameDatabaseValues) {
            console.log(chalk.magentaBright("> Database changed, reinjecting tasks."));
            // If different, stop the scheduler and reinject tasks
            scheduler.stop();
            await registerTasks();
            console.log(chalk.magentaBright("> Finished reinjecting tasks."));
            await checkDatabase();
        }
    });
    // Run jobs for the service
    const job = new ToadScheduler.SimpleIntervalJob({seconds: 5},task);
    scheduler.addSimpleIntervalJob(job);
}

// Handling routes
app.prepare().then(() => {
    // Clear console
    console.clear();
    // Initialize the socket.io server
    const io = new Server(3001);
    // Handle socketio connections
    io.on("connection", (socket) => {
        console.log(chalk.yellowBright(`🎯 Connected to socket ${socket.id}`));
    });

    // Create server
    createServer((req,res) => {
        const parsedUrl = parse(req.url!, true)
        handle(req,res,parsedUrl)
    }).listen(port, async () => {
        console.log(`⚡ ${chalk.blue("Theta")} ${chalk.magentaBright('CSI')}\n${chalk.cyanBright(`> Running on Port ${port} as ${
            dev ? 'development' : process.env.NODE_ENV
        }.`)}`)    
        // Register server cron functions
        console.log(chalk.magentaBright("> Registering Tasks"))
        await checkDatabase();
        await registerTasks();
        console.log(chalk.magentaBright("> Finished registering Tasks"))    
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