'use client';

import { useSearchParams } from "next/navigation";

export default function ServicePage() {
    console.log(useSearchParams().get("id"));
    return (
        <>
            <h1>Network ID {useSearchParams().get("id")}</h1>
        </>
    )
}