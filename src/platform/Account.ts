// use server declaration since it is a server action
'use server'

// Library Imports
import {db} from '@/db/db'
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from 'next/navigation';

/*
    Our create account function allows us to create an account
    relative as a server action and checking if it exists, if not,
    then it is created.
*/
export async function createAccount(formInfo: FormData) {
    // Get all of the form information as a dictionary
    let formResponse = (Object.fromEntries(await formInfo));
    // Create an array with each of the unique form entries
    let [fullName, username, password] = [
        formResponse.fullName,
        formResponse.username,
        formResponse.password,
    ]
    // Create a check to see if there are any users, if not, then make the user and give them owner.
    // if ((await (await db).select().from(user)).length == 0) {
    //     (await db).insert(user).values({
    //         // Need to ignore such errors, occur frequently
    //         // @ts-ignore
    //         'name': fullName,
    //         'username': username,
    //         'password': password,
    //         role: "owner"
    //     })
    //     return redirect('/login')
    // }
    // Check if the user exists, if not, then create.
    return redirect("");
}