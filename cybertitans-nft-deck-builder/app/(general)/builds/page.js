import { options } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/client'
import { getServerSession } from 'next-auth/next'
import { useSession } from 'next-auth/react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

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

    async function handleDelete(formData) {
        'use server'
        // console.log("formData", formData);
        const id = Number(formData.get("id"))

        if (isNaN(id)) {
            console.log("build id is NaN");
            return notFound()
        }

        const build = await prisma.build.delete({
            where: {
                id: id
            }
        })

        console.log("build deleted succesfully: ", build);

        revalidatePath("/builds")
    }

    return (<div className='flex justify-center'>
        <div className='w-1/3'>
            <div className="">
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
                                <td><Link href={`/builds/${build.id}`} className='underline'>{build.name}</Link></td>
                                <td>{build.authorEmail}</td>
                                <td>
                                    <form action={handleDelete}>
                                        <input type="hidden" name="id" value={build.id} />
                                        <button type="submit" className='underline'>Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>)
}