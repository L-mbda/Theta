/*
    Page for checking service status
*/
"use client";

import { useEffect, useState } from "react";

// Poll 🧌
export function ServiceCheck({id}: any) {
    // Use states
    const [status, setStatus] = useState("🟡 Loading...")
    // Fetch for service status repeating every second
    useEffect(() => {
        // Create fetch status function to check if service is online
        const fetchStatus = async () => {
            try {
                // Fetch status and get data
                const response = await fetch(`/api/gon/`, {
                    method: "POST",
                    body: JSON.stringify({
                        id: id
                    })
                })
                
                const data = await response.json()
                // If isOnline is true, then set online, else, set offline
                if (data.isOnline) {
                    setStatus("🟢 Online")
                } else {
                    setStatus("🔴 Offline")
                }
            } catch (e) {
                setStatus("🔴 Offline")
            }
        }

        // Set interval to run using polling forever and clear
        const interval = setInterval(fetchStatus, 3000)
        return () => clearInterval(interval)
    }, [id])
    return (
        <span className="text-[18px] flex gap-2 items-center">{status}</span>
    )
}