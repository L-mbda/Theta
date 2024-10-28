/* 
    Relative imports for the Theta Application,
    including the database, mantine imports for UI, and server actions
*/
import {db} from '@/db/db'
import { user } from "@/db/schema";
import { Button, PasswordInput, TextInput } from '@mantine/core';
import { createOwnerAccount } from '@/platform/Account';

export default async function thetaSystem() {
    // Initialize database and check if there are any users, if there aren't, then display a signup form.
    let check = (await (await db).select().from(user));
    if (check.length == 0) {
        return (
            <main className='bg-blue-800 text-white w-[100%] h-[100vh] p-4 justify-center items-center flex'>
                {/* Display a "Build your Theta" form with the action onSubmit going to a server action called
                createAccount */}
                <div className='div max-w-[500px] bg-blue-950 p-4 rounded-md'>
                    <h1 className='font-bold text-[40px]'>Build your Theta</h1>
                    <p className=''>Welcome to Theta! It is nice to have you here as you go on your journey with the status manager. However, first, we need to setup the panel and dashboard for you. Please create your account.</p>
                    <br />
                    <form className='flex gap-3 flex-col' action={createOwnerAccount}>
                        <TextInput placeholder='Gon Freecss' name='fullName' label={"Name:"} required/>
                        <TextInput placeholder='gfreecss' name='username' label={"Username:"} required/>
                        <PasswordInput placeholder='🞄🞄🞄🞄🞄🞄🞄🞄🞄🞄' name='password' label={"Password"} required/>
                        <Button type='submit'>Create Theta</Button>
                    </form>
                </div>
            </main>
        )
    // else
    } else {
        let backgroundImage = "https://media1.tenor.com/m/kFo4_ao93MgAAAAC/hunter-x-hunter-nanika.gif"
        // Return login page
        return (
            <>
                {/* Creating the main page for the background and then the image */}
                <main className='w-[100%] h-screen text-white bg-cover flex items-center'
                style={{backgroundImage: `url("${backgroundImage}")`}}>
                    <div className='bg-red-950 lg:w-[25vw] rounded-md min-h-[65vh]
                    ml-10 p-5'>
                        <h1 className='font-semibold text-[40px] w-[75%]'>Welcome to Theta.</h1>
                    </div>
                </main>
            </>
        )
    }
}