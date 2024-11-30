/*
    - Theta: /api/gin
        * Returns all service history entries for a specific service based on ID
*/

// Relative imports
import { db } from "@/db/db";
import { serviceHistory } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Routes
export async function POST(request: NextRequest) {
    const data = await request.json();
    // Obtain all database information
    const databaseInformation = await (await db).select({
        "time": serviceHistory.time,
        "reachableStatus": serviceHistory.reachableStatus,
    }).from(serviceHistory)
    .where(eq(serviceHistory.serviceID, data.id)).orderBy(asc(serviceHistory.time));
    return NextResponse.json({
        // Data
        'data': databaseInformation,
    }, {status: 200})
}