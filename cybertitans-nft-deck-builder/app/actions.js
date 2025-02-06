"use server"

import { prisma } from "@/client"
import { Prisma } from "@prisma/client"

export async function persistItemsInBoard(persistedSlots) {
    await prisma.build.create({
        data: {
            name: "test_build",
            itemsBoardSlots: persistedSlots
        }
    })

    console.log("items saved", persistedSlots)
}

export async function persistSynergiesCounter(synergies) {
    // await prisma.build.create({
    //     data: {

    //     }
    // })

    await prisma.build.update({
        where: {
            id: 1
        },
        data: {
            synergies
        }
    })
    console.log("synergies saved", synergies)
}


export async function persistBoard(board) {
    // Replace null values with empty strings
    // console.log(board);


    const sanitizedBoard = board.map(item => item === null ? '' : item);
    console.log("board sano", sanitizedBoard);


    // await prisma.build.update({
    //     where: {
    //         id: 1,
    //     },
    //     data: {
    //        board: sanitizedBoard
    //     }
    // })

    // console.log("board saved", sanitizedBoard)
}


export async function saveBuild(buildName, user, persistedSlots, synergies, sanitizedBoard) {
    try {
        const build = await prisma.build.create({
            data: {
                name: buildName,
                itemsBoardSlots: persistedSlots,
                synergies: synergies,
                board: sanitizedBoard,
                author : {
                    connect: { email: user.email }
                }
            }
        })

        console.log("build created successfully: ", build)
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code) {
                console.log(
                    'Known error:', e.message
                )
            } else console.log("Unknown error :", e)
        }
        throw e
    }


}