'use client';

// Relative imports
import { Button, Loader, NumberInput, SegmentedControl, Text, TextInput } from "@mantine/core";
import { GalleryHorizontal, GalleryHorizontalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Create interface
interface Service {
    id: number;
    monitorURL: string;
    monitorType: string;
    maxRetries: number;
    heartbeatInterval: number;
    name: string;
}

// Edit service component
export function EditServiceComponent({serviceComponent}: any) {
    // Create interface for service
    const service: Service = serviceComponent;
    // Create states
    const [monitorType, setMonitorType] = useState(service.monitorType);
    // Set states for multiple different application aspects
    // Create submit state
    const [buttonState, setButtonState] = useState(false);    
    return (
        <div className="flex flex-col gap-4" id="formA">
            <TextInput name="id" style={{display:'none'}} readOnly defaultValue={service.id} placeholder="1" size="md" label={'Service ID'} radius={"xl"} description="The ID of the service."  required/>
            {/* Monitor name */}
            <TextInput name="service_name" defaultValue={service.name} placeholder="My Beautiful Service" size="md" label={'Service Name:'} radius={"xl"} description="Necessary for services to have a name."  required/>
            {/* Monitor type */}
            <div className="flex flex-col gap-2">
                <Text>Monitor Type:</Text>
                <SegmentedControl
                name="monitor_type"
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
                // Substitute with values
                defaultValue={service.monitorType}
                size="md" radius={"xl"}/>
            </div>
            {/* Logic for showing specific monitor type */}
            {
                (monitorType == 'http') ? (
                    <TextInput name="monitor_url" defaultValue={(service.monitorType == 'http') ? service.monitorURL : ""} placeholder="theta.example.org" size="md" label={'Monitor URL'} radius={"xl"} description="The URL to utilize to check the heartbeat of."  required/>
                ):(
                    <TextInput name="monitor_url" defaultValue={service.monitorURL} placeholder="192.168.9.2" size="md" label={'Hostname'} radius={"xl"} description="IP address or hostname to ping."  required/>
                )
            }
            {/* Max retries, hearbeat, etc/ */}                                                                                                {/* Max retries, hearbeat, etc/ */}
            <NumberInput name="heartbeat_interval" value={service.heartbeatInterval} id="heartbeat_interval" placeholder="6" size="md" label={'Heartbeat Interval'} radius={"xl"} min={1} description={(
                <span id="heartbeat_interval_text">
                    The service will be checked every {service.heartbeatInterval > 1 ?  `${service.heartbeatInterval} seconds` : "second"}.
                </span>
            )} onChange={(value) => {
                // Changes the value of the interval description based on the value changed
                // @ts-ignore
                document.getElementById('heartbeat_interval_text').innerHTML = (value != 1) ? `The service will be checked every ${value} seconds.` : "The service will be checked every second."
            }} defaultValue={0}  required/>
            <NumberInput value={service.maxRetries} name="retries" placeholder="6" size="md" label={'Maximum Retries'} radius={"xl"} min={0} description="The maximum amount of retries allowed before raising an notice and marking the service as down." defaultValue={0}  required/>
            {
                buttonState ? <Button radius={'xl'}><Loader color="white" size={'sm'} /></Button> : <Button type="submit" radius={'xl'}>Create Service</Button>
            }
        </div>
    )
}