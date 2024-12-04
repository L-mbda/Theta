/*
    Theta components for the settings page
    ©2024 L-mbda. Open source under the MPL-v2 license.
*/
'use client'

// Imports
import "@/styles/StatusButtons.css";
import { Button, Modal, NativeSelect, PasswordInput, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { UserPen, UserPlus } from "lucide-react";
import { createUserAccount } from "../Account";

/*
    Component for the create account button under the user access section
*/
export function CreateAccount({userRole}: {userRole: string | null}) {
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <>
            {/* Modal */}
            <Modal color="dark" opened={opened}
            onClose={close} title={(<span className="flex flex-row justify-center items-center gap-3">
                <UserPen />
                <p className="font-bold text-[17.5px]">Create Account</p>
            </span>)} centered>
                {/* Body for Modal */}
                <Modal.Body>
                    <form className="flex flex-col gap-4" action={createUserAccount}>
                        {/* User Name */}
                        <TextInput name="name" label="Name" placeholder="Gon Freecss" radius={'lg'}
                        description="The name of the new user account."
                        required/>
                        {/* Username input */}
                        <TextInput name="username" label="Username" placeholder="gfreecss" radius={'lg'}
                        description="The username of the new user account (needs to be unique)."
                        required
                        />
                        {/* Password input */}
                        <PasswordInput name="password" label="Password" placeholder="Password" radius={'lg'}
                        description="The password of the new user account."
                        required
                        />
                        {/* Select type */}
                        <NativeSelect name="role" defaultValue={'user'} label="Account Type" description="Type of account being created with different given permissions." data={(userRole == 'owner') ? ['user', 'admin'] : ['user']} required />
                        {/* Button to Submit */}
                        <Button type="submit" radius={'lg'} color="indigo">Create Account</Button>
                    </form>
                </Modal.Body>
            </Modal>
            {/* Button to create an incident to open a modal */}
            <Button onClick={open} leftSection={(<UserPlus />)}>Create Account</Button>
        </>
    )
}