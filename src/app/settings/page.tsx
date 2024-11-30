import { AuthenticateServer } from "@/platform/Account";
import Link from "next/link";

// default exports
export default async function Settings() {
    // Get user info by running authentication function
    const userInfo = await AuthenticateServer();

    // Render page
    return (
        <>
            <main>
                <nav className="bg-inherit border-b-gray-700 border-b-[1px] p-5 shadow-lg flex flex-row">
                    <Link href={'/dashboard'} className="font-black text-[30px]">Theta</Link>
                </nav>
                <div className="flex flex-col justify-center items-center min-h-[80vh]">
                </div>
                <footer className="flex pb-3 bottom-3 gap-4 items-center w-full invisible md:visible justify-center">
                    <p>Theta v1 Enterprise</p>
                    <p>©{new Date().getFullYear()} L-mbda. Licensed under the MPL-v2 license.</p>
                </footer>
            </main>
        </>
    )
}