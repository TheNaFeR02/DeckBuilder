"use client"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Builds() {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/client')
        }
    })
    
    if (!session?.user) return

    return (<div><p>Estas logeado</p></div>)
    
}