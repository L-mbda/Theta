// Imports
import {db} from '@/db/db'
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Home() {
  // Initialize database and check if there are any users, if there aren't, then display a signup form by redirecting to `/theta` route.
  let check = (await (await db).select().from(user));
  if (check.length == 0) {
    return redirect("/theta");
  }
  return (
    <>
      <h1>Theta</h1>
    </>
  );
}
