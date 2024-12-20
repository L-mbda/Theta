'use client'
import { Authenticate } from "@/platform/Account"
import {getServices} from "@/platform/Services"
import { useEffect, useState } from "react"
// Icons imports
import { BadgeCheck, CircleAlert, HeartPulse, PlusSquareIcon } from "lucide-react";
import { Button } from "@mantine/core";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";
import { ServiceCheck } from "@/platform/components/ServiceCheck";

// Connect to socketio
const socket = io("http://localhost:3001");

// Create a socket connection
socket.on("connect", () => {
    console.log(socket.id);
});

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
                        <h1 className="text-4xl font-bold">Welcome back!</h1>
                        <p>What would you like to do today?</p>
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
            return redirect('/logout');
        } else {
            // Actual thing we are rendering
            return (
                <main>
                    {/* Navbar */}
                    <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row items-center">
                        <Link href={'/dashboard'} className="font-black text-[30px]">Theta</Link>
                    </nav>
                    {/* Links */}
                    <div className="flex flex-row gap-4 p-5">
                        <Link href={'/dashboard'} className="flex gap-2 items-center hover:bg-gray-700 bg-gray-800 p-2 rounded-lg transition-all">
                            <p>Dashboard</p>
                        </Link>
                        <Link href={'/status'} className="flex gap-2 items-center hover:bg-gray-700 p-2 rounded-lg transition-all">
                            <p>Status Page</p>
                        </Link>
                        <Link href={'/settings'} className="flex gap-2 items-center hover:bg-gray-700 p-2 rounded-lg transition-all">
                            <p className="flex flex-row items-center justify-center">Settings</p>
                        </Link>
                    </div>

                    {/* Body for our content */}
                    <div className="flex flex-col p-10 gap-3 min-h-[80vh]">
                        {/* For our welcome header */}
                        <div>
                            {/* @ts-ignore */}
                            <h1 className="text-4xl font-black">Welcome back, {user.name}!</h1>
                            <p>What would you like to do today?</p>
                        </div>
                        {/* For our actions */}
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[20px] font-bold">Your Services:</h2>
                            {
                                // Display a button to create a service if a user role is
                                // admin or owner.
                                // @ts-ignore
                                (user.role == 'owner' || user.role == "admin") ? 
                                (
                                    <Button className="max-w-[40%]" component={Link} href={'/create/service'}>
                                        {/* For controlling spacing and centering of 
                                            the icon and text
                                        */}
                                        <span className="gap-1 flex justify-center items-center">
                                            <PlusSquareIcon /> Create Service
                                        </span>
                                    </Button>
                                ) : (null)
                            }
                            <br />
                            {/* Create question if service exists */}
                            {/* <div className="grid pt-2"> */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {
                                    // Ternary operation for rendering
                                    // @ts-ignore
                                    serviceState == null ? (
                                        // Rendering for if null
                                        <div className="min-h-[75px] lg:w-[80%] w-[75%] bg-gray-800 rounded-md flex flex-col p-5 items-center justify-center gap-4">
                                            <h1 className="font-semibold flex gap-2 justify-center items-center"><CircleAlert /> No services available.</h1>
                                            <p>No services have been created to be able to obtain the monitoring status of. Otherwise, they would be displayed here. Why not create a service?</p>
                                        </div>
                                    ) : (
                                        // Map the services
                                        <>
                                            {
                                                // Mapping service state using data
                                                // @ts-ignore
                                                serviceState.map((data,id) => {
                                                    return (
                                                        // Return div as a card with monitor information
                                                        <Link href={'/service?id=' + data.id} className="min-h-[200px] lg:w-[100%] w-[90%] bg-gray-800 rounded-md flex flex-col p-5 items-center justify-center gap-4"
                                                        key={id}>
                                                            <h1 className="font-bold">{data.name}</h1>
                                                            {/* Flex */}
                                                            {/* Card that redirects you to manage the service */}
                                                            <div className="flex flex-col">
                                                                <div className="flex flex-row gap-3">
                                                                    <p className="flex flex-row justify-center items-center gap-1"><BadgeCheck /> {data.monitorType}</p>
                                                                    <p className="flex flex-row justify-center items-center gap-1"><HeartPulse /> {data.heartbeatInterval} second(s)</p>
                                                                    <ServiceCheck id={data.id} />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    )
                                                })
                                            }
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    {/* Footer */}
                    <footer className="flex pb-3 bottom-3 gap-4 items-center w-full invisible md:visible justify-center">
                        <p>Theta v1 Enterprise</p>
                        <p>©{new Date().getFullYear()} L-mbda. Licensed under the MPL-v2 license.</p>
                    </footer>
                </main>
            )
        }
    }
}