import { ItemDraggable } from "@/app/_board/item";
import DeckBuilder from "@/app/deck-builder";
import { titanCard } from "@/app/utils/titan-card";
import { prisma } from "@/client";
import { notFound } from "next/navigation";


const red = 'invert(22%) sepia(96%) saturate(5375%) hue-rotate(355deg) brightness(92%) contrast(121%)'
const blue = 'invert(8%) sepia(100%) saturate(7230%) hue-rotate(248deg) brightness(95%) contrast(144%)'
const yellow = 'invert(97%) sepia(56%) saturate(2855%) hue-rotate(333deg) brightness(101%) contrast(102%)'


export default async function BuildScreen({ params }) {

    // List of items and items on the board.  --------------------

    const id = (await params).id

    const _id = Number(id)

    if (isNaN(id)) return notFound()

    // 1. Create the items/synergies that are not in the Item List. 
    // TODO: Filter by user.
    // const [itemsBoardSlots] = await prisma.build.findMany({
    //     select: {
    //         board: true,
    //         itemsBoardSlots: true,
    //         synergies: true
    //     }
    // });

    const itemsBoardSlots = await prisma.build.findUnique({
        where: {
            id: _id
        },
        select: {
            board: true,
            itemsBoardSlots: true,
            synergies: true,
            notes: true
        }
    })


    const _itemsBoardSlots = Object.values(itemsBoardSlots.itemsBoardSlots)

    const arrBoard = Array.from({ length: 32 }, () => []);

    _itemsBoardSlots.forEach((slots, i) => {
        if (slots.length !== 0) {
            slots.forEach((item, j) => {
                arrBoard[i].push(<ItemDraggable id={item.id} size={45} color={item.color} image_url={item.image_url} description={item.description} upgrade={item.upgrade}
                />)
            })
        }
    })

    // 2. Fill the Items List with the items that are not on the board. 
    const itemIdsInBoardSlots = Object.values(itemsBoardSlots.itemsBoardSlots)
        .flat()
        .map(item => item.id);

    const items = await prisma.item.findMany();

    let itemsData = {}
    items.forEach((item, index) => {
        const _itemId = `item.${item.name.toLowerCase()}`
        if (!itemIdsInBoardSlots.includes(_itemId)) {
            itemsData[`item.${item.name.toLowerCase()}-1`] = <ItemDraggable id={`item.${item.name.toLowerCase()}-1`} size={45} image_url={item.image_url} color={red} description={item.description} upgrade={item.upgrade_A} />,
                itemsData[`item.${item.name.toLowerCase()}-2`] = <ItemDraggable id={`item.${item.name.toLowerCase()}-2`} size={45} image_url={item.image_url} color={blue} description={item.description} upgrade={item.upgrade_B} />,
                itemsData[`item.${item.name.toLowerCase()}-3`] = <ItemDraggable id={`item.${item.name.toLowerCase()}-3`} size={45} image_url={item.image_url} color={yellow} description={item.description} upgrade={item.upgrade_C} />
        }
    })


    // -> itemsData> All of the items in the items list that are not in the board.
    // -> arrBoard -> All of the items that are on the board not on the items list.
    // ---------------------------------------------------  


    // 3. Deck -> titanCards
    //  titansById -> reference for all titans
    // Board -> itemsBoardSlots.board -> board saved pulled directly from the db.
    const titans = await prisma.titan.findMany(
        {
            include: {
                synergies: true
            }
        }
    );

    const titansIdOnBoard = itemsBoardSlots.board.filter(titanId => titanId !== '').map(titanId => Number(titanId))



    let titanCards = {}
    let titansById = {}
    let deckInit = {}
    titans.forEach((titan, index) => {
        if (!titansIdOnBoard.includes(titan.id))
            deckInit[titan.id] = titanCard(titan.image_url, titan.name, index, titan.id, titan.cost)

        titanCards[titan.id] = titanCard(titan.image_url, titan.name, index, titan.id, titan.cost)
        titansById[titan.id] = titan;
    });

    const boardInit = itemsBoardSlots.board.map((titanId) => titanId === "" ? null : Number(titanId))


    // 4. synergies
    const synergies = itemsBoardSlots.synergies


    // console.log("boardInit:", boardInit);
    // console.log("titanCards:", deckInit);
    // console.log("titansById:", titansById);


    return <DeckBuilder
        titans={titansById} // work as reference, never mutates
        boardInit={boardInit} // 
        titanCards={titanCards} // Instantiate the Deck
        deckInit={deckInit}
        itemsData={itemsData}
        itemBoardSlotsInit={arrBoard}
        synergiesInit={synergies}
        notesInit={itemsBoardSlots.notes}
    />
}