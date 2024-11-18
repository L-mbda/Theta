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

// Defining constants
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev})
const handle = app.getRequestHandler();

// Handling routes
app.prepare().then(() => {
    createServer((req,res) => {
        const parsedUrl = parse(req.url!, true)
        handle(req,res,parsedUrl)
    }).listen(port, () => {
        console.log(`${chalk.blue("Theta")} ${chalk.magentaBright('CSI')}\n${chalk.cyanBright(`> Running on Port ${port} as ${
            dev ? 'development' : process.env.NODE_ENV
        }.`)}`)    
    })
})