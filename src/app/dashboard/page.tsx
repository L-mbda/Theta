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
    console.log(user)
    return (
        <main className="">
            <footer className="flex bottom-3 absolute gap-4 items-center w-full justify-center">
                <p>Theta v1 Enterprise</p>
                <p>©{new Date().getFullYear()} de-y. Licensed under the MPL-v2 license.</p>
            </footer>
        </main>
    )
}