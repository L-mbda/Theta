/*
    - Theta: /api/kira
        * Creates services for the Theta status monitor 
*/
// Imports
import { NextResponse } from "next/server";

// Routes
export function POST(request: any) {
    return NextResponse.json({
        'name': 'Theta Monitoring Instance',
    })
}