import { Button } from '@mantine/core';
// Imports
import {db} from '@/db/db'
import { incidents, manager, serviceHierarchy, services, user } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from 'drizzle-orm';
import { GenerateServiceGraph } from '@/platform/components/GenerateServiceGraph';
import { ServiceCheck } from '@/platform/components/ServiceCheck';
import Link from 'next/link';

export default async function Home() {
  // Initialize database and check if there are any users, if there aren't, then display a signup form by redirecting to `/theta` route.
  const check = (await (await db).select().from(user));
  if (check.length == 0) {
    return redirect("/theta");
  }

  // Check if login only is true according to the manager
  if (!(await (await db).select().from(manager))[0].pagePublished) {
    return redirect('/theta')
  }
  // Get manager name
  const managerName = (await (await db).select().from(manager))[0].name;
  // Get incident information
  const incidentGroup = (await (await db).select().from(incidents));
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
  return (
    <main className='flex flex-col items-center gap-4 pb-5'>
      {/* Mobile Friendly 😁 */}
      {/* Header */}
      <div className='flex justify-center items-center'>
        <h1 className='font-extralight text-[40px]'>{managerName}</h1>
        
      </div>
      {/* Incidents */}
      <div className='w-full flex flex-col items-center justify-center'>
          {
              incidentGroup.length > 0 ? (
                  <div className='w-[80%] flex flex-col gap-3'>
                      <h1 className='font-extrabold text-[30px]'>Incidents</h1>
                      {
                          incidentGroup.map((incident, index) => (
                              <div key={index} className="flex flex-col min-h-[15vh] p-2 rounded-lg bg-gray-900 gap-3 mb-4 pl-5">
                                  <p className="flex-1 font-extrabold text-[23px]">{incident.name}</p>
                                  <p className="flex-1 text-[15px]">{incident.description}</p>
                                  <div>
                                      <p className="flex-1 text-[12px] text-gray-500">First Created: {new Date(parseInt(incident.firstCreated)).toLocaleString()}</p>
                                      <p className="flex-1 text-[12px] text-gray-500">Last Updated: {new Date(parseInt(incident.lastUpdated)).toLocaleString()}</p>
                                  </div>
                              </div>
                          ))
                      }
                  </div>
              ) : null
          }
      </div>
      {/* Services */}
      <div className='w-full flex flex-col items-center'>
          <h1 className='font-extrabold text-[30px]'>Services</h1>
          <div className='flex flex-col gap-4 w-[80%]'>
              {
                  hierarchyArray.map((service, index) => (
                    <div key={index} className='flex flex-col gap-4'>
                      <div>
                        {/* @ts-ignore */}
                        <h1 className='font-bold text-[25px]'>{service.name}</h1>
                        <p>Current Status: <ServiceCheck id={service.id} /></p>
                        <p>Service History</p>
                      </div>
                      <GenerateServiceGraph id={service.id} />
                    </div>
                  ))
              }
          </div>
      </div>
      {/* Footer */}
      <div className='flex flex-col justify-center items-center gap-2'>
        <hr className='w-[50vw]' />
        <p>©{new Date().getFullYear()} {managerName}</p>
        {/* Comment if you would like */}
        <p>Powered by <Link className='hover:underline' href={'https://github.com/l-mbda/theta'}>Theta</Link>.</p>
      </div>
    </main>
  );
}