'use client'
import { Authenticate } from "@/platform/Account"
import { useEffect, useState } from "react"

// Authentication framework
export default function DashboardPage() {
    // Create state for utilization
    let [user, setUser] = useState(null);
    // Try to poll the DB hehe 🧌
    useEffect(() => {
        // Get the authentication information
        // utilizing so many promises, my eyes
        // will hurt.
        Authenticate().then((credentials) => {
            // Store credentials in setUser state
            // @ts-ignore
            setUser(credentials);
        });
    },[])
    // Check and render skeleton
    if (user == null) {
        // Skeleton to render
        return (
            <main className="select-none animate-pulse">
                {/* Navbar */}
                <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row animate-pulse">
                    <h1 className="font-black text-[30px]">Theta</h1>
                </nav>
                {/* Body for our content */}
                <div className="flex flex-col p-10">
                    {/* @ts-ignore */}
                    <h1 className="text-4xl font-bold">Welcome back!</h1>
                </div>
                {/* Footer */}
                <footer className="animate-pulse flex bottom-3 absolute gap-4 items-center w-full justify-center">
                    <p>Theta v1 Enterprise</p>
                    <p>©{new Date().getFullYear()} de-y. Licensed under the MPL-v2 license.</p>
                </footer>
            </main>
        )                
    } else {
        // Actual thing we are rendering
        return (
            <main>
                {/* Navbar */}
                <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row">
                    <h1 className="font-black text-[30px]">Theta</h1>
                </nav>
                {/* Body for our content */}
                <div className="flex flex-col p-10">
                    {/* @ts-ignore */}
                    <h1 className="text-4xl font-bold">Welcome back, {user.name}!</h1>
                </div>
                {/* Footer */}
                <footer className="flex bottom-3 absolute gap-4 items-center w-full justify-center">
                    <p>Theta v1 Enterprise</p>
                    <p>©{new Date().getFullYear()} de-y. Licensed under the MPL-v2 license.</p>
                </footer>
            </main>
        )    
    }
}