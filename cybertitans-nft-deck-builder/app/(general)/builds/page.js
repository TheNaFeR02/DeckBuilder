import { options } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/client'
import { getServerSession } from 'next-auth/next'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default async function Builds() {
    const session = await getServerSession(options)

    if (!session) {
        redirect('/api/auth/signin?callbackUrl=/builds')
    }

    const builds = await prisma.build.findMany({
        where: {
            authorEmail: session.user.email
        }
    })

    console.log("my builds", builds)

    return (<div className='flex justify-center'>
        <div className='w-1/3'>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Build Name</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {builds.map((build, index) => (
                            <tr key={build.id}>
                                <th>{index + 1}</th>
                                <td>{build.name}</td>
                                <td>{build.authorEmail}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>)

}