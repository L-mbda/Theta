import {db} from '@/db/db'
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
export default async function thetaSystem() {
    let check = await (await db).select().from(user).where(eq(user.id, 1));
    if (check.length == 0) {
        return (
            <main className='bg-blue-800 w-[100%] h-[100vh] p-4'>
                <h1 className='font-bold text-[40px]'>Build your Theta</h1>
                <p className='w-[70%]'>Welcome to Theta! It is nice to have you here as you go on your journey with Theta. However, first, we need to setup the panel and dashboard for you.</p>
                
            </main>
        )
    }   
}