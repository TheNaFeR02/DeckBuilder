"use client"
import { prisma } from "@/client"
import Image from "next/image"
import { DndContext } from '@dnd-kit/core';
import { useState } from "react"
import { Draggable } from "./_board/titan-card";
import { Droppable } from "./_board/deck-slot";

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

// // Create 32 cards using the titanCard function
// const titanCards = Array.from({ length: 32 }, (_, i) =>
//   // The draggables id HAS to be the same id of the titan from the database.
//   titanCard("/image25.png", `Titan ${i + 1}`, i)
// );

export default function Home() {
  



  const [parent, setParent] = useState(null);

  const [deck, setDeck] = useState(Array(32).fill(null)); // board would be a better name

  const [titanCards, setTitanCards] = useState(Array.from({ length: 32 }, (_, i) =>
      // The draggables id HAS to be the same id of the titan from the database.
      titanCard("/image25.png", `Titan ${i + 1}`, i)
    ));

  const [currentDraggableId, setCurrentDraggableId] = useState(null); // null || id of the draggable being dragged.

  // props: image, data: name, synergy...
  const draggableMarkup = (
    <Draggable>
      <figure className="relative w-full h-full">
        <Image
          className="object-cover  border-solid border-white border-2 rounded-md"
          src="/image25.png"
          alt="Shoes"
          fill
        />
        <div className="bg-white w-5 h-6 rounded-br-md  absolute top-0 rounded-tl-md  bottom-1"></div>
        <div className="text-black absolute top-0 left-0.5">$1</div>
        <p className="text-white absolute bottom-2 left-1 text-sm">dummy1</p>
      </figure>
    </Draggable>
  );

  const droppables = Array.from({ length: 32 }).map((_, i) => i + 1);

  function handleDragEnd(event) {
    const { over } = event;

    if (!over) {
      return;
    }
    
    const droppableSelected = over.id
    
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      newDeck[droppableSelected] = currentDraggableId;
      return newDeck;
    })

    setTitanCards((prevCards) => {
      // assign null to the draggable that was dropped
      const newCards = [...prevCards];
      newCards[currentDraggableId] = null;
      return newCards;
    })

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    // setParent(over ? over.id : null);
  }

  function handleDragStart(event){
    const {active} = event;

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
              {deck[index] !== null ? titanCards[index] : null}
            </Droppable>
          ))}

        </div>


        {/* Draggable Titans */}
        <div className="flex flex-wrap gap-3 bg-neutral w-[592px] h-[360px] rounded-md p-3">
          {/* {titanCard("/image25.png", `Titan 1`)} */}
          {titanCards.map((card, index) => (
            <div key={index} className="">
              {card}
              </div>
          ))}
        </div> 

      </div>
    </DndContext>
  );
}
