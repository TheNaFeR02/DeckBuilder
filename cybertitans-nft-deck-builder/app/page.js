"use client"
import { prisma } from "@/client"
import Image from "next/image"
import { DndContext } from '@dnd-kit/core';
import { useState } from "react"
import { Draggable } from "./_board/titan-card";
import { Droppable } from "./_board/deck-slot";


const titans = [
  { id: 0, image: "/image25.png", name: "Titan 0" },
  { id: 1, image: "/image25.png", name: "Titan 1" },
  { id: 2, image: "/image25.png", name: "Titan 2" },
]

// this function will use the data from the db. For now we will use dummy data.
function titanCard(image, name, id) {
  return <Draggable id={id}>
    <figure className="relative w-full h-full">
      <Image
        className="object-cover  border-solid border-white border-2 rounded-md"
        src={image}
        alt={name}
        fill
      />
      <div className="bg-white w-5 h-6 rounded-br-md  absolute top-0 rounded-tl-md  bottom-1"></div>
      <div className="text-black absolute top-0 left-0.5">$1</div>
      <p className="text-white absolute bottom-2 left-1 text-sm">{name}</p>
    </figure>
  </Draggable>
}

export default function Home() {

  const [deck, setDeck] = useState(Array(32).fill(null)); // board would be a better name

  const titanCards = titans.map((titan, index) => titanCard(titan.image, titan.name, index));

  const [deckCards, setDeckCards] = useState(Array.from(Array(32).keys())); // array of ids of the titans in the deck


  const [currentDraggableId, setCurrentDraggableId] = useState(null); // null || id of the draggable being dragged.

  // props: image, data: name, synergy...
  // const draggableMarkup = (
  //   <Draggable>
  //     <figure className="relative w-full h-full">
  //       <Image
  //         className="object-cover  border-solid border-white border-2 rounded-md"
  //         src="/image25.png"
  //         alt="Shoes"
  //         fill
  //       />
  //       <div className="bg-white w-5 h-6 rounded-br-md  absolute top-0 rounded-tl-md  bottom-1"></div>
  //       <div className="text-black absolute top-0 left-0.5">$1</div>
  //       <p className="text-white absolute bottom-2 left-1 text-sm">dummy1</p>
  //     </figure>
  //   </Draggable>
  // );

  const droppables = Array.from({ length: 32 }).map((_, i) => i + 1);

  function handleDragEnd(event) {
    const { over } = event;

    if (!over) {
      return;
    }

    const droppableSelected = over.id

    

    setDeck((prevDeck) => {
      const pos = prevDeck.indexOf(currentDraggableId)

      if (prevDeck[droppableSelected] !== null) {
        return prevDeck
      }

      if (pos === -1) {
        const newDeck = [...prevDeck];
        newDeck[droppableSelected] = currentDraggableId;
        return newDeck;
      }

      prevDeck[pos] = null
      const newDeck = [...prevDeck]
      newDeck[droppableSelected] = currentDraggableId;
      return newDeck;
    })

    setDeckCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[currentDraggableId] = null;
      console.log("newDeckCards", newCards);
      return newCards;
    })

  }

  function handleDragStart(event) {
    const { active } = event;


    // active.id is the id of the draggable being dragged.
    setCurrentDraggableId(active.id);
  }

  return (
    <DndContext
      id="draggable-table-01"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="h-screen flex gap-10 justify-center flex-col items-center">

        {/* Board */}
        <div className="grid grid-cols-8 gap-2 w-[592px] h-[360px] border-solid rounded-md">

          {/* {droppables.map((id) => (
            <Droppable id={id} key={id}>
              {parent === id ? draggableMarkup : null}
            </Droppable>
          ))} */}

          {deck.map((item, index) => (
            <Droppable id={index} key={index}>
              {/* deck[index] is the id of the Draggable element that is on that deck slot */}
              {deck[index] !== null ? titanCards[deck[index]] : null}
            </Droppable>
          ))}

        </div>


        {/* Draggable Titans */}
        <div className="flex flex-wrap gap-3 bg-neutral w-[592px] h-[360px] rounded-md p-3">

          {deckCards.map((id, index) => (
            // render titanCards[index] if deckCards[index] is not null. Remember the key since is a list.
            deckCards[index] !== null ? <div key={index}>{titanCards[deckCards[index]]}</div> : null
            // deckCards[index] !== null ? 
            // <div key={index}>{titanCards[deckCards[index]]}</div>
            // : null



          ))}
        </div>

      </div>
    </DndContext>
  );
}

// 1. titans from the db
// [
// { id: 1, image: "/image25.png", name: "Titan 1" }, 
// { id: 2, image: "/image25.png", name: "Titan 2" }, ...]

// 2. Array of draggables: titanCards. It converts the array of titans into an array of draggable components. This array is used as reference to render the draggable titans.
// [<Draggable id={0}>, <Draggable id={2}>  , <Draggable id={3}> ...] current cards on the slots of the deck.

// 3. Array of draggables: (deckCards)
// [0, 1, 2, 3, 4, 5, ... , 31] 32 items
// every time an card is dragged to the board, it becomes null in that position.
// ex: [0, 1, 2, 3, null, 5, ... , 31]

// 2. Array of droppables: (board)
// [null, null, ... , null] 32 items


// 3. When a draggable is dropped on a droppable, the array of droppables should be updated with the id of the draggable dropped AND the draggable should be removed from the array of draggables.




