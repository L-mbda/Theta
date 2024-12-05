import { db } from "@/db/db";
import { incidents, manager, serviceHierarchy, services } from "@/db/schema";
import { AuthenticateServer } from "@/platform/Account";
import { DragDropServices } from "@/platform/components/Status";
import { CreateIncident, DeleteIncident, EditIncident, PublishSwitch } from "@/platform/components/StatusButtons";
import { Button } from "@mantine/core";
import { eq } from "drizzle-orm";
import { CircuitBoard, ExternalLink } from "lucide-react";
import Link from "next/link";

// default exports
export default async function Settings() {
    // Get user info by running authentication function
    await AuthenticateServer();
    // Define manager
    const statusManager = (await (await db).select().from(manager))[0];
    // Define Incident Reports
    const incidentArray = await (await db).select().from(incidents);
    // Define services
    const servicesGroup = await (await db).select().from(services);
    // Define service hierarchy array
    // @ts-ignore
    const hierarchyArray = [];
    // Get each service of the service group
    for (const service of servicesGroup) {
        // Get Hierarchy ID and information
        const hierarchyInformation = await (await db).select().from(serviceHierarchy).where(eq(serviceHierarchy.serviceID, service.id));
        const id = hierarchyInformation[0].id;
        // Insert service into hierarchyArray based on where ID is falling between
        // Create flag
        let pushed = false;
        // for loop to insert
        for (let i = 0; i < hierarchyArray.length; i++) {
            // @ts-ignore
            if (hierarchyArray[i].id < id) {
                hierarchyArray.splice(i, 0, { id, service });
                pushed = true;
                break;
            }
        }
        // Else if not pushed, push to end
        if (!pushed) {
            hierarchyArray.push({ id, service });
        }
    }
    // Reverse array
    hierarchyArray.reverse();
    // Remove id aspect from hierarchy array
    for (let i = 0; i < hierarchyArray.length; i++) {
        // Reassign the index
        // @ts-ignore
        hierarchyArray[i] = hierarchyArray[i].service;
    }
    // Render page
    return (
        <>
            <main>
                {/* Navbar */}
                <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row items-center">
                    <Link href={'/dashboard'} className="font-black text-[30px]">Theta</Link>
                </nav>
                {/* Links */}
                <div className="flex flex-row gap-4 p-5">
                    <Link href={'/dashboard'} className="flex gap-2 items-center hover:bg-gray-700 p-2 rounded-lg transition-all">
                        <p>Dashboard</p>
                    </Link>
                    <Link href={'/status'} className="flex gap-2 items-center hover:bg-gray-700 bg-gray-800 p-2 rounded-lg transition-all">
                        <p>Status Page</p>
                    </Link>
                    <Link href={'/settings'} className="flex gap-2 items-center hover:bg-gray-700 p-2 rounded-lg transition-all">
                        <p className="flex flex-row items-center justify-center">Settings</p>
                    </Link>
                </div>
                {/* Content */}
                <div className="flex flex-col pl-6 min-h-[80vh] gap-4">
                    <div className="flex justify-between pr-10 items-center">
                        <h1 className="font-bold text-[30px]"><CircuitBoard size={35} /> Status Page</h1>
                        {/* Option for publishing the status page */}
                        <PublishSwitch loginOnly={statusManager.pagePublished} />
                    </div>
                    {/* Modals for various buttons */}
                    <div className="flex gap-2">
                        <CreateIncident />
                        {
                            (statusManager.pagePublished) ? (
                                // Button that opens the site in the new tab
                                <Button leftSection={(<ExternalLink size={20} />)} color="grape" component={Link} href={'/'} target="_blank">View Page</Button>
                            ) : null
                        }
                    </div>
                    {/* Map array in column format */}
                    <div className="flex flex-col gap-4">
                        <h2 className="font-bold text-[27px]">Incidents</h2>
                        {
                            incidentArray.length === 0 ? <p>No Incidents Created.</p> : (
                                <>
                                    {
                                        incidentArray.map((incident, index) => (
                                            <div key={index}>
                                                <div className="w-[75%] flex flex-col min-h-[15vh] p-2 rounded-lg bg-gray-900 gap-3">
                                                    <p className="flex-1 font-extrabold text-[23px]">{incident.name}</p>
                                                    <p className="flex-1 text-[15px]">{incident.description}</p>
                                                    <div>
                                                        <p className="flex-1 text-[12px] text-gray-500">First Created: {new Date(parseInt(incident.firstCreated)).toLocaleString()}</p>
                                                        <p className="flex-1 text-[12px] text-gray-500">Last Updated: {new Date(parseInt(incident.lastUpdated)).toLocaleString()}</p>
                                                    </div>
                                                    <EditIncident incident={incident} />
                                                    <DeleteIncident incident={incident} />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>
                            )
                        }
                    </div>
                    {/* Thy drag and drop for services and adding */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="font-bold text-[27px]">Services on Status Page</h2>
                            <p>Drag and Drop to reorder services.</p>
                        </div>
                        {
                        hierarchyArray.length != 0 ? (
                            <div className="bg-gray-900 w-[90%] rounded-md p-3">
                                {/* @ts-ignore */}
                                <DragDropServices services={hierarchyArray} />
                            </div>                
                        ) : (<p>No services were created. Please create one before continuing.</p>)
                        }
                    </div>
                </div>
                {/* Footer */}
                <footer className="flex pb-3 bottom-3 gap-4 items-center w-full invisible md:visible justify-center">
                    <p>Theta v1 Enterprise</p>
                    <p>©{new Date().getFullYear()} L-mbda. Licensed under the MPL-v2 license.</p>
                </footer>
            </main>
        </>
    )
}