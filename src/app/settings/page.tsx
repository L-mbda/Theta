import { db } from "@/db/db";
import { manager } from "@/db/schema";
import { AuthenticateServer } from "@/platform/Account";
import { changeStatusPageName } from "@/platform/Manager";
import { Button, TextInput } from "@mantine/core";
import Link from "next/link";

// default exports
export default async function Settings() {
    // Get user info by running authentication function
    const userInfo = await AuthenticateServer();
    // Get status page manager info
    const managerInfo = (await (await db).select().from(manager))[0]

    // Render page
    return (
        <>
            <main>
                <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row">
                    <Link href={'/dashboard'} className="font-black text-[30px]">Theta</Link>
                </nav>
                {/* Links */}
                <div className="flex flex-row gap-4 p-5">
                    <Link href={'/dashboard'} className="flex gap-2 items-center hover:bg-gray-700 p-2 rounded-lg transition-all">
                        <p>Dashboard</p>
                    </Link>
                    <Link href={'/status'} className="flex gap-2 items-center hover:bg-gray-700 p-2 rounded-lg transition-all">
                        <p>Status Page</p>
                    </Link>
                    <Link href={'/settings'} className="flex gap-2 items-center hover:bg-gray-700 bg-gray-800 p-2 rounded-lg transition-all">
                        <p className="flex flex-row items-center justify-center">Settings</p>
                    </Link>
                </div>
                {/* Settings section */}
                <div className="flex gap-3 flex-col p-5 min-h-[90vh]">
                    <div className="width-[70%]">
                        <h1 className="font-semibold text-[30px]">Settings</h1>
                        <hr className="width-[70%]" />
                    </div>
                    {/* Div that contains information about the server and stuff */}
                    <div className="flex flex-col gap-3 w-[90%]"> 
                        <h2 className="font-light text-[25px]">Information</h2>
                        {/* Instance Name and stuff */}
                    </div>
                    {/* Div for editing title */}
                    <div className="flex flex-col gap-3 w-[90%]"> 
                        <h2 className="font-light text-[25px]">Status Page Settings</h2>
                        {/* Form for changing status page name */}
                        <form className="w-[70%] flex flex-col gap-3" action={changeStatusPageName}>
                            <TextInput label="Status Page Name:" placeholder="My Favorite Status Page" defaultValue={managerInfo.name} radius={'lg'}
                            className="width-[50%]" required name="new_name" />
                            <Button className="width-[50%]" type="submit" radius={'lg'}>Change Name</Button>
                        </form>
                    </div>
                </div>
                <footer className="flex pb-3 bottom-3 gap-4 items-center w-full invisible md:visible justify-center">
                    <p>Theta v1 Enterprise</p>
                    <p>©{new Date().getFullYear()} L-mbda. Licensed under the MPL-v2 license.</p>
                </footer>
            </main>
        </>
    )
}