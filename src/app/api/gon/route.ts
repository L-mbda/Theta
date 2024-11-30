/*
    - Theta: /api/gon
        * Checks if server is reachable based on latest serviceHistory entry for a given service ID
*/

// Relative imports
import { db } from "@/db/db";
import { serviceHistory } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Routes
export async function POST(request: NextRequest) {
    const data = await request.json();
    // Store database service history into database information
    const databaseInformation = await (await db).select().from(serviceHistory)
    .where(eq(serviceHistory.serviceID, data.id)).orderBy(desc(serviceHistory.time)).limit(1);
    if (databaseInformation.length == 0) {
        return NextResponse.json({
            'isOnline': false,
        }, {
            'status': 404
        })
    } else {
        return NextResponse.json({
            // @ts-ignore
            'isOnline': databaseInformation[0].reachableStatus,
        })
    }
}