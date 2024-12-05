/*
    Theta components for the settings page
    ©2024 L-mbda. Open source under the MPL-v2 license.
*/
'use client'

// Imports
import "@/styles/StatusButtons.css";
import { Button, Modal, NativeSelect, PasswordInput, Table, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { Edit, Edit2, Trash, Trash2, UserPen, UserPlus } from "lucide-react";
import { createUserAccount, deleteUserAccount, editUserAccount } from "../Account";
import { SyntheticEvent, useState } from "react";

// For managing users, create an interface
interface user {
    id: number,
    name: string,
    username: string,
    role: string,
}

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
                        <NativeSelect name="role" radius={'lg'} defaultValue={'user'} label="Account Type" description="Type of account being created with different given permissions." data={(userRole == 'owner') ? ['user', 'admin'] : ['user']} required />
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

/*
    Component for the create account button under the user access section
*/
export function EditAccount({targetUser, userRole}: {targetUser: user, userRole: string | null}) {
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <>
            {/* Modal */}
            <Modal color="dark" opened={opened}
            onClose={close} title={(<span className="flex flex-row justify-center items-center gap-3">
                <UserPen />
                <p className="font-bold text-[17.5px]">Edit Account</p>
            </span>)} centered>
                {/* Body for Modal */}
                <Modal.Body>
                    <form className="flex flex-col gap-4" action={editUserAccount}>
                        {/* Target ID */}
                        <TextInput name="user_id" className="hidden" defaultValue={targetUser.id} readOnly={true}/>
                        {/* User Name */}
                        <TextInput name="name" label="Name" defaultValue={targetUser.name} placeholder="Gon Freecss" radius={'lg'}
                        description="The name of the user account."
                        required/>
                        {/* Username input */}
                        <TextInput name="username" defaultValue={targetUser.username} label="Username" placeholder="gfreecss" radius={'lg'}
                        description="The username of the user account (needs to be unique)."
                        required
                        />
                        {/* Select type */}
                        <NativeSelect name="role" defaultValue={targetUser.role} radius={'lg'} label="Account Type" description="Type of account being with different given permissions." data={(userRole == 'owner') ? ['user', 'admin'] : ['user']} required />
                        {/* Button to Submit */}
                        <Button type="submit" radius={'lg'} color="indigo">Edit Account</Button>
                    </form>
                </Modal.Body>
            </Modal>
            {/* Button to create an incident to open a modal */}
            <Button onClick={open} leftSection={(<UserPen />)}>Edit Account</Button>
        </>
    )
}

/*
    Component for the delete account button under the user access section
*/
export function DeleteAccount({targetUser}: {targetUser: user}) {
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <>
            {/* Modal */}
            <Modal color="dark" opened={opened}
            onClose={close} title={(<span className="flex flex-row justify-center items-center gap-3">
                <Trash />
                <p className="font-bold text-[17.5px]">Delete Account</p>
            </span>)} centered>
                {/* Body for Modal */}
                <Modal.Body>
                    <form className="flex flex-col gap-4" action={deleteUserAccount}>
                        <h1>By deleting {targetUser.name}&apos;s account, you confirm that their access will be revoked to the server and their information will be deleted. This is not reversible.</h1>
                        <TextInput name="user_id" className="hidden" defaultValue={targetUser.id} readOnly={true}/>
                        {/* Button to Submit */}
                        <Button type="submit" radius={'lg'} color="red">I confirm, delete the account</Button>
                    </form>
                </Modal.Body>
            </Modal>
            {/* Button to create an incident to open a modal */}
            <Button onClick={open} color="red" leftSection={(<Trash2 />)}>Delete Account</Button>
        </>
    )
}


/*
    Management button
*/
export function ManageAccount({userIdentity, role}: {userIdentity: user, role: string | null}) {
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <>
            {/* Modal */}
            <Modal color="dark" opened={opened}
            onClose={close} title={(<span className="flex flex-row justify-center items-center gap-3">
                <Edit />
                <p className="font-bold text-[17.5px]">Manage Account</p>
            </span>)} centered>
                {/* Body for Modal */}
                <Modal.Body>
                    <form className="flex flex-col gap-4">
                        <h1>This is the menu for managing {userIdentity.name}&apos;s account. Nothing may be displayed, depending on your permissions.</h1>
                        {
                            ((role == 'admin' ? 1 : (role == 'owner') ? 2 : 0) > (userIdentity.role == 'admin' ? 1 : userIdentity.role == 'owner' ? 2 : 0)) ?
                            (
                                <>
                                    <EditAccount userRole={role} targetUser={userIdentity} />
                                    <DeleteAccount targetUser={userIdentity} />
                                </>
                            ) : null
                        }
                    </form>
                </Modal.Body>
            </Modal>
            {/* Button to create an incident to open a modal */}
            <Button onClick={open} color="pink" leftSection={(<Edit2 />)}>Manage Account</Button>
        </>
    )
}


/*
    Export users
*/
export function UserTable({users, permissions}: {users: any,permissions:any}) {
    const [userAccess, setUsers] = useState<user[]>(users);
    // Function to update search based on wha was looked up
    function updateSearch(event: SyntheticEvent) {
        const searchedArr = []
        event.preventDefault()
        // @ts-ignore
        const searchKeyword = event.target.value;
        if (searchKeyword == '') {
            setUsers(users);
            return;
        }
        for (const index in userAccess) {
            // @ts-ignore
            const account = userAccess[index];
            // Search by name or username
            if (account.name.toLowerCase().includes(searchKeyword.toLowerCase()) || account.username.toLowerCase().includes(searchKeyword.toLowerCase())) {
                searchedArr.push(account);
            }
        }
        setUsers(searchedArr);
    }
    return (
        <>
            {/* Search */}
            <TextInput label="Filter" radius={'lg'} placeholder="Gon Freecss" description="Filter by name or username to be able to look up in accounts." onChange={updateSearch} />
            <br />
            {/* Table */}
            <Table withRowBorders withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Username</Table.Th>
                        <Table.Th>Role</Table.Th>
                        <Table.Th>Management</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                {/* Body */}
                <Table.Tbody>
                    {
                        userAccess.map((user, id) => (
                            <Table.Tr key={id}>
                                <Table.Td>{user.name}</Table.Td>
                                <Table.Td>{user.username}</Table.Td>
                                <Table.Td>{user.role}</Table.Td>
                                <Table.Td><ManageAccount userIdentity={user} role={permissions} /></Table.Td>
                            </Table.Tr>
                        ))
                    }
                </Table.Tbody>
            </Table>
        </>
    )
}