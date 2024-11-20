/*
    - Theta: /api/kira
        * Creates services for the Theta status monitor 
*/
// Imports
import { db } from "@/db/db";
import { manager, services } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

// Routes
export async function POST(request: NextRequest) {
    // Obtain data
    const data = await request.json();
    console.log(await db.select().from(services))
    /*
        Data is structured as follows:
        serviceName: name of the service
        monitorType: Type of monitor being utilized
        heartbeatInterval: interval for heartbeat
        maximumRetries: Maximum amount of retries allowed.
        monitorURL: URL of the monitor/hostname
    */
    // Insert information into the database
    await db.insert(services).values({
        'name': data.serviceName,
        'managerID': (await db.select().from(manager))[0].id,
        'heartbeatInterval': data.heartbeatInterval,
        'maxRetries': data.maximumRetries,
        'monitorType': data.monitorType,
        'monitorURL': data.monitorURL
    })
    return NextResponse.json({
        'name': 'Service successfully created!',
        'status': true,
    })

}