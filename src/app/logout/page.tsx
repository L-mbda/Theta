/*
    Defines the logout page
*/
'use client'

// Import the server action and function
import { LogoutAccount } from "@/platform/Account"
import { redirect } from "next/navigation";
import { useEffect } from "react";

// Logout page
export default function LogoutPage() {
    // Place in useEffect for rendering
    useEffect(() => {
        LogoutAccount().then(
            () => {
                return redirect('/theta');
            }
        );    
    }, [])
}