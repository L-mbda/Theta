/*
    Server action/core library file for Theta Services
    ©2024 L-mbda. Open source under the MPL-v2 license.
*/
"use server"
import {db} from '@/db/db'
import { serviceHistory, services } from "@/db/schema";
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

/*
    The function attempts to get the services that are active
    to be able to review and function.
*/
export async function getServices() {
    // Check service entries from DB
    const serviceCheck = await (await db).select().from(services);
    // Log in and check if length is 0
    if (serviceCheck.length == 0) {
        // Return information
        return {
            'servers': null,
        }
    // otherwise, return servers
    } else {
        return {
            'servers': serviceCheck
        }
    }
}

/*
    The function is used to edit the service information
    based on parameters and ID.
*/
export async function editService(params: FormData) {
    const id = params.get('id');
    // Check if null or undefined and redirect
    if (id === undefined) {
        return redirect('/service/edit?id=null')
    }
    // Obtain service info
    // @ts-ignore
    const serviceInfo = await (await db).select().from(services).where(eq(services.id, id))
    // If length is 0, redirect or else up
    if (serviceInfo.length == 0) {
        return redirect('/service/edit?id=null')
    }
    // Update the service parameters based on ID.
    await (await db).update(services).set({
        // @ts-ignore
        'name': params.get('service_name'),
        // @ts-ignore
        'heartbeatInterval': params.get('heartbeat_interval'),
        // @ts-ignore
        'maxRetries': params.get('retries'),
        // @ts-ignore
        'monitorType': params.get('monitor_type'),
        // @ts-ignore
        'monitorURL': params.get('monitor_url'),
    // @ts-ignore
    }).where(eq(services.id, id));
    // Return and redirect to service page
    return redirect('/service?id=' + id);
}

/*
    The function deletes the service based on the provided ID
*/
export async function deleteService(params: FormData) {
    const id = params.get('id');
    // Check if null or undefined and redirect
    if (id === undefined) {
        return redirect('/service/edit?id=null')
    }
    // Obtain service info
    // @ts-ignore
    const serviceInfo = await (await db).select().from(services).where(eq(services.id, id))
    // If length is 0, redirect or else delete service
    if (serviceInfo.length == 0) {
        return redirect('/service/edit?id=null')
    }
    // Delete the service based on ID
    // @ts-ignore
    await (await db).delete(services).where(eq(services.id, id));
    // Wipe information from service history
    // @ts-ignore
    await (await db).delete(serviceHistory).where(eq(serviceHistory.serviceID, id));
    // Return and redirect to dashboard
    return redirect('/dashboard');
}