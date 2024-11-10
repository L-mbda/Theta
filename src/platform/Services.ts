/*
    Server action/core library file for Theta Services
    ©2024 L-mbda. Open source under the MPL-v2 license.
*/
"use server"
import {db} from '@/db/db'
import { services } from "@/db/schema";

/*
    The function attempts to get the services that are active
    to be able to review and function.
*/
export async function getServices() {
    // Check service entries from DB
    let serviceCheck = await (await db).select().from(services);
    // Log in and check if length is 0
    if (serviceCheck.length == 0) {
        // Return information
        return {
            'servers': null,
        }
    }
}