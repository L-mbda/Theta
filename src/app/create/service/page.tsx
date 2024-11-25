'use client'
import { Authenticate } from "@/platform/Account"
import { useEffect, useState } from "react"
import {deleteCookie} from "cookies-next";
// Icons imports
import { Button, Loader, NumberInput, SegmentedControl, Text, TextInput } from "@mantine/core";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { GalleryHorizontal, GalleryHorizontalEnd } from "lucide-react";

// Authentication framework
export default function DashboardPage() {
    // Create router object
    const router = useRouter();
    // Create state for user
    const [user, setUser] = useState(null);
    // Create states
    const [monitorType, setMonitorType] = useState("http");
    // Set states for multiple different application aspects
    // Create submit state
    const [buttonState, setButtonState] = useState(false);    
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
            setLoadingStatus(false);
        });
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
            return redirect('/theta')
        } else {
            // createService function
            function createService(event: any) {
                // Prevent reload lmao
                event.preventDefault();
                // Sett Button loading state to true
                // setButtonState(true);
                // Get elements from form
                const [serviceName, monitorType, heartbeatInterval, maximumRetries, monitorURL] = [
                    event.target['service_name'].value,
                    event.target['monitor_type'].value,
                    event.target['heartbeat_interval'].value,
                    event.target['retries'].value,
                    event.target['monitor_url'].value,
                ]
                // Send to API for service as POST request
                fetch("/api/kira", {
                    'method': "POST",
                    'body': JSON.stringify({
                        'serviceName': serviceName,
                        'monitorType': monitorType,
                        'heartbeatInterval': heartbeatInterval,
                        'maximumRetries': maximumRetries,
                        'monitorURL': monitorURL,
                    })
                // Insanely complicated logic using then statements instead of await
                }).then((res) => {res.json().then((data) => {
                    if (data.status) {
                        router.push('/dashboard')
                    } else {
                        setButtonState(false);
                    }
                })})
            }
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
                            user.role != "user" ? (<>
                                {/* Render the process for creating a service */}
                                <div className="flex flex-col items-center min-h-[30vh] p-10 gap-5">
                                    <h1 className="font-bold text-[30px]">Create a Service</h1>
                                    {/* Add further text */}
                                    <div className="flex flex-row  min-w-[100%]">
                                        {/* Form and attempt to deal with onSubmit */}
                                        <form id="form_create" onSubmitCapture={createService}>
                                            {/* Form A: Basics */}
                                            <div className="flex flex-col gap-4" id="formA">
                                                <h1 className="font-semibold text-[20px]">Basic Information</h1>
                                                {/* Monitor name */}
                                                <TextInput name="service_name" placeholder="My Beautiful Service" size="md" label={'Service Name:'} radius={"xl"} description="Necessary for services to have a name."  required/>
                                                {/* Monitor type */}
                                                <div className="flex flex-col gap-2">
                                                    <Text>Monitor Type:</Text>
                                                    <SegmentedControl
                                                    name="monitor_type"
                                                    defaultValue="http"
                                                    color="blue"
                                                    // If monitor type changes, set that to event.target?.value
                                                    onClick={(event) => {
                                                        // @ts-ignore
                                                        setMonitorType(event.target?.value)
                                                    }}
                                                    data={[
                                                        // For HTTP Monitor
                                                        {'value': "http", 'disabled': false, 'label': (
                                                            <span className="flex flex-row justify-center items-center gap-1">
                                                                <GalleryHorizontal />
                                                                HTTP
                                                            </span>
                                                        )},
                                                        // Ping Monitor
                                                        {'value': "ping", 'disabled': false, 'label': (
                                                            <span className="flex flex-row justify-center items-center gap-1">
                                                                <GalleryHorizontalEnd />
                                                                Ping
                                                            </span>
                                                        )}
                                                    ]}
                                                    size="md" radius={"xl"}/>
                                                </div>
                                                {/* Logic for showing specific monitor type */}
                                                {
                                                    monitorType == 'http' ? (
                                                        <TextInput name="monitor_url" placeholder="theta.example.org" size="md" label={'Monitor URL'} radius={"xl"} description="The URL to utilize to check the heartbeat of."  required/>
                                                    ):(
                                                        <TextInput name="monitor_url" placeholder="192.168.9.2" size="md" label={'Hostname'} radius={"xl"} description="IP address or hostname to ping."  required/>
                                                    )
                                                }
                                                {/* Max retries, hearbeat, etc/ */}                                                                                                {/* Max retries, hearbeat, etc/ */}
                                                <NumberInput name="heartbeat_interval" id="heartbeat_interval" placeholder="6" size="md" label={'Heartbeat Interval'} radius={"xl"} min={1} description={(
                                                    <span id="heartbeat_interval_text">
                                                        The service will be checked every second.
                                                    </span>
                                                )} onChange={(value) => {
                                                    // Changes the value of the interval description based on the value changed
                                                    // @ts-ignore
                                                    document.getElementById('heartbeat_interval_text').innerHTML = (value != 1) ? `The service will be checked every ${value} seconds.` : "The service will be checked every second."
                                                }} defaultValue={0}  required/>
                                                <NumberInput name="retries" placeholder="6" size="md" label={'Maximum Retries'} radius={"xl"} min={0} description="The maximum amount of retries allowed before raising an notice and marking the service as down." defaultValue={0}  required/>
                                                {
                                                    buttonState ? <Button radius={'xl'}><Loader color="white" size={'sm'} /></Button> : <Button type="submit" radius={'xl'}>Create Service</Button>
                                                }
                                            </div>
                                            {/* Form B */}
                                        </form>
                                    </div>
                                </div>
                            </>) : (
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
                    <footer className="flex bottom-3 pb-3 gap-4 items-center w-full invisible md:visible justify-center">
                        <p>Theta v1 Enterprise</p>
                        <p>©{new Date().getFullYear()} L-mbda. Licensed under the MPL-v2 license.</p>
                    </footer>
                </main>
            )
        }
    }
}