// use server declaration since it is a server action
'use server'

// Library Imports
import {db} from '@/db/db'
import { user } from "@/db/schema";
import { redirect } from 'next/navigation';
import * as crypto from 'crypto';
import { eq } from 'drizzle-orm';
import * as jwt from 'jose';
import { NextApiResponse } from 'next';
import { cookies } from 'next/headers';

/*
    Our create owner account function allows us to create an account
    relative as a server action and checking if it exists, if not,
    then it is created.
*/
export async function createOwnerAccount(formInfo: FormData) {
    // Get all of the form information as a dictionary
    let formResponse = (Object.fromEntries(await formInfo));
    // Create an array with each of the unique form entries
    let [fullName, accountUsername, password] = [
        formResponse.fullName,
        formResponse.username,
        // Create a hash
        await crypto.createHash("sha3-256").update(formResponse.password + "").digest("hex"),
    ]
    // Create the salting variables
    var salt1 = crypto.randomBytes(256).toString('hex');
    var salt2 = crypto.randomBytes(256).toString('hex');
    // Create a check to see if there are any users, if not, then make the user and give them owner.
    if ((await (await db).select().from(user)).length == 0) {
        await (await db).insert(user).values({
            // Need to ignore such errors, occur frequently
            // @ts-ignore
            name: fullName,
            username: accountUsername,
            salt1: salt1,
            salt2: salt2,
            // Hash the password utilizing SHA512
            password: await crypto.createHash("sha3-512").update(salt1 + password + salt2).digest("hex"),
            role: "owner"
        })
        // Redirect back to theta to allow for login
        return redirect('/theta')
    }
}

/*
    This function lets you log into the application as a server
    action.
*/
export async function loginToAccount(data: FormData) {
    // get data
    let formResponse = (Object.fromEntries(await data));
    // Create array defining all the variables
    let [username, password] = [formResponse.username,
        // Ignore the error obtained from the form response password
        // @ts-ignore
        await crypto.createHash("sha3-256").update(formResponse.password + "").digest("hex"),
    ]
    // Check to see if the user is equal, if not, then do some stuff. Keep ignoring
    // for some linting reason
    // @ts-ignore
    let check = (await (await db).select().from(user).where(eq(user.username, username)));
    // If the check is not equal to 0, move on and continue
    if (check.length != 0) {
        // Salt the password so it'll be more secure.
        let saltedPassword = await crypto.createHash("sha3-512").update(check[0].salt1 + password + check[0].salt2).digest("hex");
        // Get first instance and check if the password is equal
        if (check[0].password == saltedPassword) {
            // Assign JWT
            // @ts-ignore
            let token = await new jwt.SignJWT().setProtectedHeader({alg: 'HS256'}).setExpirationTime("1d").sign(crypto.createSecretKey(process.env?.JWT_SECRET, "utf-8"));
            // Create cookie for the JWT called token AND SET samesite to strict
            await cookies().set("token", token, {'sameSite': 'strict'});
            // Return redirect
            return redirect('/dashboard')
        } else {
            // Return error
            return redirect('?message=Incorrect username or password.')
        }
    } else {
        // Return error code with incorrect username or password
        return redirect('?message=Incorrect username or password.')
    }
}