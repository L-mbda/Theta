import Image from "next/image";
import {db} from '@/db/db'
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  let check = await (await db).select().from(user).where(eq(user.id, 1));
  console.log(check)
  return (
    <>
      <h1>Theta</h1>
    </>
  );
}
