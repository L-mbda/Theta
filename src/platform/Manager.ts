/*
    Server action/core library file for Status Page
    ©2024 L-mbda. Open source under the MPL-v2 license.
*/
"use server"
import {db} from '@/db/db'
import { incidents, manager } from "@/db/schema";
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { AuthenticateAPI } from './Account';

/*
    The function changes the value of if status page is published or not.
*/
export async function changeVisibility() {
    const auth = await AuthenticateAPI();
    if (auth.valid != false) {
        // Obtain current value of loginOnly
        const currentStatus = (await (await db).select().from(manager))[0];
        // Update value of loginOnly in database
        await (await db).update(manager).set({'pagePublished': !currentStatus.pagePublished}).where(eq(manager.id, currentStatus.id));
    }
}

/*
    The function logs an incident to the database.
*/
export async function postIncident(event: FormData) {
    const auth = await AuthenticateAPI();
    if (auth.valid) {
        // Check if incident exists and delete that incident
        if ((await (await db).select().from(incidents)).length != 0) {
            // Delete incident
            await (await db).delete(incidents).where(eq(incidents.id, (await (await db).select().from(incidents))[0].id));
        }
        // Define incident name and description
        const [incidentName, incidentDescription] = [await event.get('incident_name'),
        await event.get('incident_description')];
        // Create timestamps
        const firstCreated = new Date().getTime();
        const lastUpdated = new Date().getTime();
        // Insert incident details into database
        await (await db).insert(incidents).values({
            // @ts-ignore
            'name': incidentName,
            'description': incidentDescription,
            'firstCreated': firstCreated,
            'lastUpdated': lastUpdated
        })
    }
    return redirect('/status');
}

/*
    Function to edit an incident.
    editIncident
*/
export async function editIncident(event: FormData) {
    const auth = await AuthenticateAPI();
    if (auth.valid) {
        // Get incident name, description, ID
        const [incidentName, incidentDescription, incidentID] = [await event.get('incident_name'),
        await event.get('incident_description'), await event.get('incident_id')];
        // Update details
        await (await db).update(incidents).set({
            // @ts-ignore
            'name': incidentName,
            // @ts-ignore
            'description': incidentDescription,
            // @ts-ignore
            'lastUpdated': new Date().getTime()
        // @ts-ignore
        }).where(eq(incidents.id, incidentID));
        // Return redirect
    }
    return redirect('/status')
}

/*
    Function to delete an incident.
*/
export async function deleteIncident(event: FormData) {
    const auth = await AuthenticateAPI();
    if (auth.valid) {
        // Get incident name, description, ID
        const [incidentID] = [await event.get('incident_id')];
        // Update details
        // @ts-ignore
        await (await db).delete(incidents).where(eq(incidents.id, incidentID));
    }
    // Return redirect
    return redirect('/status')
}

/*
    Function to change the status page name and other essentials
*/
export async function changeStatusPageName(event: FormData) {
    const auth = await AuthenticateAPI();
    if (auth.valid) {
        const newName = await event.get('new_name');
        // Update name based on manager ID
        // @ts-ignore
        (await (await db).update(manager).set({"name": newName}).where(eq(manager.id, (await (await db).select().from(manager))[0].id)))
    }
    // Refresh page
    return redirect('/settings');
}