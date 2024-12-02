/*
    - Theta: /api/leorio
        * Updates service hierarchy for the theta status monitor (PATCH)
        (AUTHENTICATION REQUIRED) 
*/
// Imports
import { db } from "@/db/db";
import { manager, serviceHierarchy, services } from "@/db/schema";
import { AuthenticateAPI } from "@/platform/Account";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Routes
export async function PATCH(request: NextRequest) {
    // Obtain data
    const data = await request.json();
    // Check if user is properly authenticated
    const authenticationData = await AuthenticateAPI();
    // If authentication.valid is false or roles dont match, reject
    if (authenticationData.valid == false) {
        return NextResponse.json({
            'status': 'You are not allowed to perform this action.',
        }, {
            'status': 403
        })
    }

   // Continue with updating hierarchy by checking for changes
    const hierarchyData = data.services;
    // Iterate and update hierarchy individual service info
    for (let i = 0; i < hierarchyData.length; i++) {
        // Get hierarchy ids
        const service = hierarchyData[i];
        const newID = (i+1) * 100;
        // Update hierarchy
        await (await db).update(serviceHierarchy).set({
            'id': newID,
        }).where(eq(serviceHierarchy.serviceID, service.id));
    }
    // Return confirmation of hierarchy update
    return NextResponse.json({
        'status': 'Service hierarchy updated.'
    }, {
        'status': 202
    });
}