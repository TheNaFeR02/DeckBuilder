"use server"

import { prisma } from "@/client"
import { Prisma } from "@prisma/client"
import { MaxBuildsExceededError } from "./utils/errors"



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
        const buildsList = await prisma.build.findMany();

        if (buildsList.length > 10) throw new MaxBuildsExceededError("Maximum number of builds exceeded. Max builds per user is 10.");

        const build = await prisma.build.create({
            data: {
                name: buildName,
                itemsBoardSlots: persistedSlots,
                synergies: synergies,
                board: sanitizedBoard,
                author: {
                    connect: { email: user.email }
                }
            }
        })

        console.log("build created successfully: ", build)
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle Prisma-specific errors
            console.log('Known Prisma error:', e.message);

        }

        throw e

    }


}