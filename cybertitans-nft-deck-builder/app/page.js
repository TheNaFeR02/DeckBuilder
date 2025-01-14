"use client"
import { prisma } from "@/client"
import Image from "next/image"
import { DndContext } from '@dnd-kit/core';
import { useState } from "react"
import { Draggable } from "./_board/titan-card";
import { Droppable } from "./_board/deck-slot";
import { titanCard } from "@/app/utils/titan-card"


// dummy data
const titans = [
  { id: 0, image: "/image25.png", name: "Titan 0" },
  { id: 1, image: "/image25.png", name: "Titan 1" },
  { id: 2, image: "/image25.png", name: "Titan 2" },
]

const synergy = { fuego: 2, tierra: 0 }

export default function Home() {
  const [board, setBoard] = useState(Array(32).fill(null)); // board would be a better name
  const titanCards = titans.map((titan, index) => titanCard(titan.image, titan.name, index));
  const [deck, setDeck] = useState(Array.from(Array(32).keys())); // array of ids of the titans in the deck
  const [currentDraggableId, setCurrentDraggableId] = useState(null); // null || id of the draggable being dragged.

  function handleDragEnd(event) {
    const { over } = event; // null if not over a droppable or the droppable id if it is over a droppable.

    // 1. if the draggable is not over a droppable, we don't need to do anything.
    if (!over) {
      return;
    }

    // 2. if the draggable is over a droppable, we need to check if the droppable is the deck of cards or a slot on the board.
    const droppableSelected = over.id

    // 3. if the droppable is not the deck of cards and the slot on the board is already occupied, we don't need to do anything.
    if (droppableSelected !== '_deck' && board[droppableSelected] !== null) {
      return
    }

    setBoard((prevDeck) => {
      // 4. if the droppable is the deck of cards, we need to check where the card was at the moment.
      //    4.1 if the card was not on the board, we don't need to do anything.
      //    4.2 if the card was on the board, we need to update the deck of cards and empty the slot on the board.

      const pos = prevDeck.indexOf(currentDraggableId)
      const isOnTheBoard = pos !== -1

      if (droppableSelected === '_deck') {

        // 4.1 ---
        // Nothing changes on the board. 
        // Ex: dragged the item from the deck and put it back in the deck.
        if (!isOnTheBoard) return prevDeck


        // 4.2 ---
        // Update the deck of cards.
        setDeck((prevCards) => {
          const newCards = [...prevCards]
          newCards[currentDraggableId] = currentDraggableId
          return newCards
        })

        // Empty the slot on the board.
        const newDeck = [...prevDeck]
        newDeck[pos] = null
        return newDeck
      }

      // 5. if the droppable is a slot on the board. the card could be already on the board or not.
      //    5.1 if the card is not on the board, we need to update the deck of cards and put the card on the board.
      //    5.2 if the card is on the board, we need to empty the slot on the board and put the card on the board.
      // if the card is NOT in the board then simply put it on it.

      // 5.1 ---
      // Update the deck of cards. Discard the card from the deck.
      if (!isOnTheBoard) {
        setDeck((prevCards) => {
          const newCards = [...prevCards];
          newCards[currentDraggableId] = null;
          return newCards;
        })

        // Put the card on the board.
        const newDeck = [...prevDeck];
        newDeck[droppableSelected] = currentDraggableId;
        return newDeck;
      }

      // 6. if the card is already on the board, you can move it to a different empty slot on the board.
      prevDeck[pos] = null
      const newDeck = [...prevDeck]
      newDeck[droppableSelected] = currentDraggableId;
      return newDeck;
    })
  }

  function handleDragStart(event) {
    const { active } = event;

    // active.id is the id of the draggable (titan card) being dragged.
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
          {board.map((item, index) => (
            <Droppable id={index} key={index}>
              <div className="h-[80px] w-[70px] border-solid border-2 border-neutral rounded-md">
                {/* deck[index] is the id of the Draggable element that is on that deck slot */}
                {board[index] !== null ? titanCards[board[index]] : null}
              </div>
            </Droppable>
          ))}
        </div>
        {/* Board end */}

        {/* Deck: (Draggable Titans cards) */}
        <Droppable id="_deck">
          <div className="flex flex-wrap gap-3 bg-neutral w-[592px] h-[360px] rounded-md p-3">
            {deck.map((id, index) => (
              deck[index] !== null ? <div key={index}>{titanCards[deck[index]]}</div> : null
            ))}
          </div>
        </Droppable>
        {/* Deck end */}


      </div>
    </DndContext>
  );
}

// 1. titans from the db
// [
// { id: 1, image: "/image25.png", name: "Titan 1" }, 
// { id: 2, image: "/image25.png", name: "Titan 2" }, 
// ...
// ]

// 2. Array of draggables: JSX Elements[]: titanCards. It converts the array of titans into an array of draggable components. This array is used as reference to render the draggable titans.
// [<Draggable id={0}>, <Draggable id={2}>  , <Draggable id={3}> ...] current cards on the slots of the deck.

// 3. Array of draggables: (deckCards)
// [0, 1, 2, 3, 4, 5, ... , 31] 32 items
// every time an card is dragged to the board, it becomes null in that position.
// ex: [0, 1, 2, 3, null, 5, ... , 31]

// 4. Array of droppables: (board)
// [null, null, ... , null] 32 items






