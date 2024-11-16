'use client'
import { Authenticate } from "@/platform/Account"
import {getServices} from "@/platform/Services"
import { useEffect, useState } from "react"
import {deleteCookie} from "cookies-next";
// Icons imports
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Authentication framework
export default function DashboardPage() {
    // Create router object
    const router = useRouter();
    // Create state for user
    const [user, setUser] = useState(null);
    // Set states for multiple different application aspects
    // Create services state
    const [serviceState, setServiceState] = useState(null);
    // Create loading state
    const [loadingStatus, setLoadingStatus] = useState(true);
    // Try to poll the DB hehe 🧌
    useEffect(() => {
        // Get the authentication information
        // utilizing so many promises, my eyes
        // will hurt. (necessary)
        Authenticate().then((credentials) => {
            // Store credentials in setUser state
            // @ts-ignore
            setUser(credentials);

        });
        // Get services using function
        // Set the loading status to false
        async function loadRest() { 
            // Declare variable for calling getServices.
            const services = await getServices()
            // Ignore error
            // @ts-ignore
            setServiceState(services?.servers);
            // If flag is set tpo
            setLoadingStatus(false);
        }
        // Call manufactured function
        loadRest();
    },[])
    // Check and render skeleton
    if (loadingStatus) {
        // Skeleton to render
        return (
            <main className="select-none animate-pulse">
                {/* Navbar */}
                <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row animate-pulse">
                    <h1 className="font-black text-[30px]">Theta</h1>
                </nav>
                {/* Body for our content */}
                <div className="flex flex-col p-10 gap-3">
                    {/* Just a div. */}
                    <div>
                        {/* @ts-ignore */}
                    </div>
                </div>
                {/* Footer */}
                <footer className="animate-pulse flex bottom-3 absolute gap-4 items-center w-full invisible md:visible justify-center">
                    <p>Theta v1 Enterprise</p>
                    <p>©{new Date().getFullYear()} L-mbda. Licensed under the MPL-v2 license.</p>
                </footer>
            </main>
        )                
    } else {

        // If undefined, delete cookie and redirect
        if (user == undefined) {
            deleteCookie('token');
            // Redirect
            return router.push('/theta')
        } else {
            // Actual thing we are rendering
            return (
                <main>
                    {/* Navbar */}
                    <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row">
                        <h1 className="font-black text-[30px]">Theta</h1>
                    </nav>
                    {/* Body for our content */}
                    <div className="flex flex-col p-10 gap-3">
                        {/* Check if allowed to create a service, if not, then deny */}
                        {
                            // @ts-ignore
                            user.role == "user" ? (<></>) : (
                                // Our rejection, say denied and have button to home
                                <div className="flex flex-col justify-center items-center min-h-[80vh]">
                                    {/* Greet user and say that you may be at the wrong page */}
                                    <div className="gap-5 flex flex-col lg:w-[50%]">
                                        <div>
                                            {/* @ts-ignore */}
                                            <h1 className="font-extrabold text-[40px]">Hello, {user.name}!</h1>
                                            <p className="text-[20px] lg:w-[70%]">Apologies, but are you at the right page?  If you aren&#39;t, use the button below to take you back to the dashboard.</p>
                                        </div>
                                        {/* Button to take back home */}
                                        <Button color="dark" component={Link} href={'/dashboard'}><span className="text-[15px] font-bold">Take me back!</span></Button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    {/* Footer */}
                    <footer className="flex bottom-3 absolute gap-4 items-center w-full invisible md:visible justify-center">
                        <p>Theta v1 Enterprise</p>
                        <p>©{new Date().getFullYear()} L-mbda. Licensed under the MPL-v2 license.</p>
                    </footer>
                </main>
            )
        }
    }
}