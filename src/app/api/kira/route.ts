/*
    - Theta: /api/kira
        * Creates services for the Theta status monitor
        (AUTHENTICATION REQUIRED) 
*/
// Imports
import { db } from "@/db/db";
import { manager, serviceHierarchy, services } from "@/db/schema";
import { AuthenticateAPI } from "@/platform/Account";
import { NextRequest, NextResponse } from "next/server";

// Routes
export async function POST(request: NextRequest) {
    // Obtain data
    const data = await request.json();
    // Check if user is properly authenticated
    const authenticationData = await AuthenticateAPI();
    // If authentication.valid is false or roles dont match, reject
    if (authenticationData.valid == false || 
        // @ts-ignore
        authenticationData.user.role == 'user'
    ) {
        return NextResponse.json({
            'status': 'You are not allowed to perform this action.',
        }, {
            'status': 403
        })
    }

    /*
        Data is structured as follows:
        serviceName: name of the service
        monitorType: Type of monitor being utilized
        heartbeatInterval: interval for heartbeat
        maximumRetries: Maximum amount of retries allowed.
        monitorURL: URL of the monitor/hostname
    */
    // Insert information into the database
    const databaseInfo = await (await db).insert(services).values({
        'name': data.serviceName,
        'managerID': (await db.select().from(manager))[0].id,
        'heartbeatInterval': (data.heartbeatInterval > 0) ? data.heartbeatInterval : 1,
        'maxRetries': data.maximumRetries,
        'monitorType': data.monitorType,
        'monitorURL': data.monitorURL
    }).returning()
    // Insert service id into service hierarchy
    // @ts-ignore
    await (await db).insert(serviceHierarchy).values({
        // Get length of service hierarchy and increment by 1
        'id': (await (await db).select().from(serviceHierarchy)).length + 1,
        'parentID': (await db.select().from(manager))[0].id,
        'serviceID': databaseInfo[0].id,
    })
    return NextResponse.json({
        'name': 'Service successfully created!',
        'status': true,
    })

}