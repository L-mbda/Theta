// import { useSearchParams } from "next/navigation";

import { db } from "@/db/db";
import { services } from "@/db/schema";
import { AuthenticateServer } from "@/platform/Account";
import { EditServiceComponent } from "@/platform/components/EditServiceComponent";
import { deleteService, editService } from "@/platform/Services";
import { Button, Group, TextInput } from "@mantine/core";
import { eq } from "drizzle-orm";
import { GroupIcon, IdCardIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

export default async function ServicePage({params, searchParams}: any) {
    // Get user info by running authentication systems
    const userInfo = await AuthenticateServer();
    // Define id using searchParams
    const id = await (await searchParams).id;
    try {
        // Obtain database information
        const serviceInfo = await (await db).select().from(services).where(eq(services.id, id))
        // Check if exists, if not, then render a not found page
        if (serviceInfo.length === 0 || userInfo.role == 'user') {
            return (
                <main>
                    <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row">
                        <h1 className="font-black text-[30px]">Theta</h1>
                    </nav>
                    <div className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row">
                        <h1>Service</h1>
                    </div>    
                    <div className="flex flex-col justify-center items-center min-h-[80vh]">
                        {/* Greet user and say that you may be at the wrong page */}
                        <div className="gap-5 flex flex-col lg:w-[50%]">
                            <div>
                                {/* @ts-ignore */}
                                <h1 className="font-extrabold text-[40px]">Hello, {userInfo.name}!</h1>
                                <p className="text-[20px] lg:w-[70%]">Apologies, but are you at the right page?  If you aren&#39;t, use the button below to take you back to the dashboard.</p>
                            </div>
                            {/* Button to take back home */}
                            <Button color="dark" component={Link} href={'/dashboard'}><span className="text-[15px] font-bold">Take me back!</span></Button>
                        </div>
                    </div>

                    <footer className="flex pb-3 bottom-3 gap-4 items-center w-full invisible md:visible justify-center">
                        <p>Theta v1 Enterprise</p>
                        <p>©{new Date().getFullYear()} L-mbda. Licensed under the MPL-v2 license.</p>
                    </footer>
                </main> 
            )
        }
        // reassign value to serviceInfo
        const service = serviceInfo[0];
        // Render
        return (
            <main>
                {/* Navbar */}
                <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row">
                    <Link href={'/dashboard'} className="font-black text-[30px]">Theta</Link>
                </nav>
                <div className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row items-center gap-5">
                    <h1 className="font-semibold">{service.name}</h1>
                    <Group justify="center">
                        <Button color="dark" className="flex items-center" leftSection={<GroupIcon size={20} className="justify-center" />} component={Link} href={`/service?id=${id}`}><span className="text-[15px] font-bold">Overview</span></Button>
                        {
                            (userInfo.role === 'admin' || userInfo.role === 'owner') ?                     <Button color="gray" className="flex items-center" leftSection={<PencilIcon size={20} className="justify-center" />} component={Link} href={`/service/edit?id=${id}`}><span className="text-[15px] font-bold">Edit Service</span></Button>
                            : null 
                        }
                    </Group>
                </div>    
                {/* Body for our content */}
                <div className="flex flex-col p-10 gap-3">
                    {/* Basic information */}
                    <div>
                        <h1 className="text-[50px] font-black"><span className="font-semibold">Edit</span> {service.name}</h1>
                        <p className="text-[15px] flex flex-row gap-2 items-center"><IdCardIcon size={20} /><code>{service.id}</code></p>
                    </div>
                    <br />
                    <div className="flex flex-row gap-10">
                        {/* Service inputs */}
                        {/* Send to action */}
                        <form className="w-[50%]" action={editService}>
                            {/* Edit service component */}
                            <EditServiceComponent serviceComponent={service} />
                        </form>
                        {/* Danger actions */}
                        <div className="flex flex-col gap-5 max-w-[30vw]">
                            <div>
                                <h1 className="font-bold text-[20px]">Other Actions</h1>
                                <p>Please note that clicking the buttons will result in service deletion.</p>                                   
                            </div>
                            {/* Delete the service */}
                            <form action={deleteService}>
                                {/* Our text containing the ID */}
                                <TextInput type="hidden" value={service.id} name="id" />
                                {/* Button to submit to be able to delete the service */}
                                <Button color="red" type="submit" leftSection={(<Trash2Icon />)}>Delete Service</Button>
                            </form>
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
    } catch (e) {
        return (
            <main>
                <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row">
                    <h1 className="font-black text-[30px]">Theta</h1>
                </nav>
                <div className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row">
                    <h1>Service</h1>
                </div>    
                <div className="flex flex-col justify-center items-center min-h-[80vh]">
                    {/* Greet user and say that you may be at the wrong page */}
                    <div className="gap-5 flex flex-col lg:w-[50%]">
                        <div>
                            {/* @ts-ignore */}
                            <h1 className="font-extrabold text-[40px]">Hello, {userInfo.name}!</h1>
                            <p className="text-[20px] lg:w-[70%]">Apologies, but are you at the right page?  If you aren&#39;t, use the button below to take you back to the dashboard.</p>
                        </div>
                        {/* Button to take back home */}
                        <Button color="dark" component={Link} href={'/dashboard'}><span className="text-[15px] font-bold">Take me back!</span></Button>
                    </div>
                </div>

                <footer className="flex pb-3 bottom-3 gap-4 items-center w-full invisible md:visible justify-center">
                    <p>Theta v1 Enterprise</p>
                    <p>©{new Date().getFullYear()} L-mbda. Licensed under the MPL-v2 license.</p>
                </footer>
            </main> 
        )
       
    }
}