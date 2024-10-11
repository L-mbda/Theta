import {db} from '@/db/db'
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Home() {
  let check = await (await db).select().from(user).where(eq(user.id, 1));
  if (check.length == 0) {
    return redirect("/theta");
  }
  return (
    <>
      <h1>Theta</h1>
    </>
  );
}
