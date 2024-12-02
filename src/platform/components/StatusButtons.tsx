/*
    Theta Components for various Status Buttons
    ©2024 L-mbda. Open source under the MPL-v2 license.
*/
'use client';

// Import CSS File
import "@/styles/StatusButtons.css";
import { Button, Modal, Switch, Textarea, TextInput } from "@mantine/core";
import { changeVisibility, deleteIncident, editIncident, postIncident } from "../Manager";
import { useState } from "react";
import { useDisclosure } from '@mantine/hooks';
import { AudioWaveform, Bluetooth, PencilIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export function PublishSwitch({loginOnly}: {loginOnly: boolean}) {
    // Create router
    const router = useRouter();
    
    // Create switch state
    const [publish, setPublish] = useState(loginOnly);
    return (
        <Switch label="Publish Page" checked={publish} onClick={(event) => {
            // Change switch
            setPublish(event.currentTarget.checked);
            // Run action
            changeVisibility();
            router.refresh();
        }} />
    )
}

export function CreateIncident() {
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <>
            {/* Modal */}
            <Modal color="dark" opened={opened}
            onClose={close} title={(<span className="flex flex-row justify-center items-center gap-3">
                <AudioWaveform />
                <p className="font-bold text-[17.5px]">Create Incident</p>
            </span>)} centered>
                {/* Body for Modal */}
                <Modal.Body>
                    <form className="flex flex-col gap-4" action={postIncident}>
                        {/* Incident Name */}
                        <TextInput name="incident_name" label="Incident Name" placeholder="Server Crash 😭" radius={'lg'}
                        description="The name of the incident."
                        required/>
                        {/* Incident description */}
                        <Textarea name="incident_description" label="Incident Description" description="The description of what happened within the incident"
                        placeholder="Server unexpectedly crashed, engineers have been dispatched." radius={'md'}
                        required/>
                        {/* Button to Submit */}
                        <Button type="submit" radius={'lg'}>Create Incident</Button>
                    </form>
                </Modal.Body>
            </Modal>
            {/* Button to create an incident to open a modal */}
            <Button onClick={open}>Create Incident</Button>
        </>
    )
}

export function EditIncident({incident}: {incident: any}) {
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <>
            {/* Modal */}
            <Modal color="dark" opened={opened}
            onClose={close} title={(<span className="flex flex-row justify-center items-center gap-3">
                <PencilIcon size={20} />
                <p className="font-bold text-[17.5px]">Edit Incident</p>
            </span>)} centered>
                {/* Body for Modal */}
                <Modal.Body>
                    <form className="flex flex-col gap-4" action={editIncident}>
                        {/* Incident ID */}
                        <TextInput name="incident_id"
                        defaultValue={incident.id} readOnly
                        className="hidden"
                        required/>
                        {/* Incident Name */}
                        <TextInput name="incident_name" label="Incident Name" placeholder="Server Crash 😭" radius={'lg'}
                        // Default value is incident name
                        defaultValue={incident.name}
                        description="The name of the incident."
                        required/>
                        {/* Incident description */}
                        <Textarea name="incident_description" label="Incident Description" description="The description of what happened within the incident"
                        placeholder="Server unexpectedly crashed, engineers have been dispatched." radius={'md'}
                        // Default value being incident description
                        defaultValue={incident.description}
                        required/>
                        {/* Button to Submit */}
                        <Button type="submit" radius={'lg'}>Edit Incident</Button>
                    </form>
                </Modal.Body>
            </Modal>
            {/* Button to edit the incident to open a modal */}
            <Button onClick={open} color="dark" leftSection={(<PencilIcon size={20} />)}><p className="font-bold">Edit Incident</p></Button>
        </>
    )
}

export function DeleteIncident({incident}: {incident: any}) {
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <>
            {/* Modal */}
            <Modal color="dark" opened={opened}
            onClose={close} title={(<span className="flex flex-row justify-center items-center gap-3">
                <PencilIcon size={20} />
                <p className="font-bold text-[17.5px]">Edit Incident</p>
            </span>)} centered>
                {/* Body for Modal */}
                <Modal.Body>
                    <form className="flex flex-col gap-4" action={deleteIncident}>
                        {/* Incident ID */}
                        <TextInput name="incident_id"
                        defaultValue={incident.id} readOnly
                        className="hidden"
                        required/>
                        {/* Confirmation */}
                        <h1 className="font-black text-[20px]">Are you sure that you would like to delete the incident?</h1>
                        <p>All incident information will be deleted. This is not a joke.</p>
                        {/* Button to Submit */}
                        <Button type="submit" color="red" radius={'lg'}>I confirm.</Button>
                    </form>
                </Modal.Body>
            </Modal>
            {/* Button to edit the incident to open a modal */}
            <Button onClick={open} color="red" leftSection={(<Trash />)}><p className="font-bold">Delete Incident</p></Button>
        </>
    )
}