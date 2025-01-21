"use client"
import { prisma } from "@/client"
import Image from "next/image"
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useEffect, useState } from "react"
import { Draggable } from "./_board/titan-card";
import { Droppable } from "./_board/deck-slot";
import { titanCard } from "@/app/utils/titan-card"


// dummy data
// const titans = [
//   { id: 0, image_url: "/image25.png", name: "Titan 0" },
//   { id: 1, image_url: "/image25.png", name: "Titan 1" },
//   { id: 2, image_url: "/image25.png", name: "Titan 2" },
// ]
const _image = "https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoHS6Sf20M6p0CnQ2ReoOIiXVslaGPASKD5NJd"


export default function DeckBuilder({
  titans,
  titanCards
}) {
  const [board, setBoard] = useState(Array(32).fill(null)); // board would be a better name
  const [deck, setDeck] = useState(titanCards); // array of ids of the titans in the deck
  const [currentDraggableId, setCurrentDraggableId] = useState(null); // null || id of the draggable being dragged.
  const [draggedItem, setDraggedItem] = useState(null);
  const [synergies, setSynergies] = useState({ "oceanic": 0, "forest": 0, "magma": 0, "desert": 0, "humanoid": 0, "electric": 0, "arctic": 0, "holy": 0, "demon": 0, "spirit": 0, "indomitable": 0, "caster": 0, "shooter": 0, "weaponsMaster": 0, "guardian": 0, "assassin": 0, "shieldmaiden": 0, "greedy": 0 })
  const [currentDraggableTitanId, setCurrentDraggableTitanId] = useState(null)


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

    setBoard((prevBoard) => {
      // 4. if the droppable is the deck of cards, we need to check where the card was at the moment.
      //    4.1 if the card was not on the board, we don't need to do anything.
      //    4.2 if the card was on the board, we need to update the deck of cards and empty the slot on the board.

      const pos = prevBoard.indexOf(currentDraggableId)
      const wasOnTheBoard = pos !== -1

      if (droppableSelected === '_deck') {

        // 4.1 ---
        // Nothing changes on the board. 
        // Ex: dragged the item from the deck and put it back in the deck.
        if (!wasOnTheBoard) return prevBoard


        // 4.2 ---
        // Update the deck of cards.
        setDeck((prevCards) => ({
          ...prevCards,
          [currentDraggableId]: titanCards[currentDraggableId]
        }))


        // Decrease one point for the synergy.
        const titanSelected = titans[currentDraggableTitanId]
        titanSelected.synergies.forEach(synergy => {
          // console.log(synergy.name.toLowerCase())
          setSynergies((prevSynergies) => ({
            ...prevSynergies,
            [synergy.name.toString().toLowerCase()]: (prevSynergies[synergy.name.toString().toLowerCase()] || 0) - 1
          }))
        })


        // Empty the slot on the board.
        const newDeck = [...prevBoard]
        newDeck[pos] = null
        return newDeck

      }

      // 5. if the droppable is a slot on the board. the card could be already on the board or not.
      //    5.1 if the card was not on the board, we need to update the deck of cards and put the card on the board.
      //    5.2 if the card was on the board, we need to empty the slot on the board and put the card on the board.
      // if the card is NOT in the board then simply put it on it.


      // 5.2-- if the card is already on the board, you can move it to a different empty slot on the board.
      if (wasOnTheBoard) {
        prevBoard[pos] = null
        const newBoard = [...prevBoard]
        newBoard[droppableSelected] = currentDraggableId;
        return newBoard;
      }

      // 5.1 ---
      // Update the deck of cards. Discard the card from the deck.

      setDeck((prevCards) => ({
        ...prevCards,
        [currentDraggableTitanId]: null
      }))

      // Increase one point for the synergy.
      const titanSelected = titans[currentDraggableTitanId]
      titanSelected.synergies.forEach(synergy => {
        // console.log(synergy.name.toLowerCase())
        setSynergies((prevSynergies) => ({
          ...prevSynergies,
          [synergy.name.toString().toLowerCase()]: (prevSynergies[synergy.name.toString().toLowerCase()] || 0) + 1
        }))
      })

      // Put the card on the board.
      const newBoard = [...prevBoard];
      newBoard[droppableSelected] = currentDraggableId;
      return newBoard;
    })

    setCurrentDraggableTitanId(null)
    setCurrentDraggableId(null);
    setDraggedItem(null);


  }

  function handleDragStart(event) {
    const { active } = event;
    // console.log(active)

    // active.id is the id of the draggable (titan card) being dragged.
    setCurrentDraggableTitanId(active.data.current.titanId)
    setCurrentDraggableId(active.id.toString());
    setDraggedItem(titanCards[active.id.toString()]);

  }

  return (
    <DndContext
      id="draggable-table-01"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="h-screen flex gap-10 justify-center flex-col items-center">


        <div className="flex flex-wrap relative">
          {/* Synergies */}
          <div className="absolute -left-48 w-48 h-[360px] overflow-y-scroll overflow-x-hidden">

            {synergies.oceanic !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.oceanic < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoEfR8pgxqIehKVUXNMJyxoDfrFncY87mw91Pa"}
                  width={60}
                  height={60}
                  alt="Oceanic"
                />
                <div>
                  <p>Oceanic</p>
                  <p>{synergies.oceanic}/8</p>
                </div>
              </div>}


            {synergies.forest !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.forest < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoCXekGqJyL4Dzoxb3I6EtBSsQqkrYVMJRgOTN"}
                  width={60}
                  height={60}
                  alt="Forest"
                />
                <div>
                  <p>Forest</p>
                  <p>{synergies.forest}/8</p>
                </div>
              </div>}


            {synergies.magma !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.magma < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8So3A5ibYzPsacoEJKTz7ji2FkgWLZUMS6eX1Qp"}
                  width={60}
                  height={60}
                  alt="Magma"
                />
                <div>
                  <p>Magma</p>
                  <p>{synergies.magma}/8</p>
                </div>
              </div>}


            {synergies.desert !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.desert < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoSOphpxnK3v92ZMKfQFXw67dA1tHjUTIL5ycD"}
                  width={60}
                  height={60}
                  alt="Desert"
                />
                <div>
                  <p>Desert</p>
                  <p>{synergies.desert}/8</p>
                </div>
              </div>
            }


            {synergies.humanoid !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.humanoid < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SopyMPChs8FzT1CPMpnKfw2Dks3jZIoY0aJtc7"}
                  width={60}
                  height={60}
                  alt="Humanoid"
                />
                <div>
                  <p>Humanoid</p>
                  <p>{synergies.humanoid}/6</p>
                </div>
              </div>
            }


            {synergies.electric !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.electric < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8So3GCPX7GzPsacoEJKTz7ji2FkgWLZUMS6eX1Q"}
                  width={60}
                  height={60}
                  alt="Electric"
                />
                <div>
                  <p>Electric</p>
                  <p>{synergies.electric}/6</p>
                </div>
              </div>
            }


            {synergies.arctic !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.arctic < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoK9fzFVUFlZSTtj0CzPIMarAVWp16yun9Hw2B"}
                  width={60}
                  height={60}
                  alt="Arctic"
                />
                <div>
                  <p>Arctic</p>
                  <p>{synergies.arctic}/8</p>
                </div>
              </div>
            }


            {synergies.holy !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.holy < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SooK2IMFhC4OiuFQILaVy3Zde68gspKJkUWTRr"}
                  width={60}
                  height={60}
                  alt="Holy"
                />
                <div>
                  <p>Holy</p>
                  <p>{synergies.holy}/6</p>
                </div>
              </div>
            }


            {synergies.demon !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.demon < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8So8hLUsUZJM4oqGQ7CTKUb09hAsZY1DkzLHxBF"}
                  width={60}
                  height={60}
                  alt="Demon"
                />
                <div>
                  <p>Demon</p>
                  <p>{synergies.demon}/8</p>
                </div>
              </div>
            }


            {synergies.spirit !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.spirit < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8Sou4WxYcpBkEOAWb3DVa9ji4tNJMXGKHPQfYUh"}
                  width={60}
                  height={60}
                  alt="Spirit"
                />
                <div>
                  <p>Spirit</p>
                  <p>{synergies.spirit}/8</p>
                </div>
              </div>
            }


            {synergies.indomitable !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.indomitable < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoOc2tmZuTQEblXohe7jMrY4gLwHaim896ytfC"}
                  width={60}
                  height={60}
                  alt="Indomitable"
                />
                <div>
                  <p>Indomitable</p>
                  <p>{synergies.indomitable}/6</p>
                </div>
              </div>
            }


            {synergies.caster !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.caster < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SojrLSt22HdJovXN34lTg08kYDntiWc2Cpy7Oj"}
                  width={60}
                  height={60}
                  alt="Caster"
                />
                <div>
                  <p>Caster</p>
                  <p>{synergies.caster}/4</p>
                </div>
              </div>
            }


            {synergies.shooter !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.shooter < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoHS6Sf20M6p0CnQ2ReoOIiXVslaGPASKD5NJd"}
                  width={60}
                  height={60}
                  alt="Shooter"
                />
                <div>
                  <p>Shooter</p>
                  <p>{synergies.shooter}/4</p>
                </div>
              </div>
            }


            {synergies.weaponsMaster !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.weaponsMaster < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoVn16LEMstHd4wh5SOiMzvqYUJQnou8N9LWCZ"}
                  width={60}
                  height={60}
                  alt="Weapons Master"
                />
                <div>
                  <p>Weapons Master</p>
                  <p>{synergies.weaponsMaster}/8</p>
                </div>
              </div>
            }


            {synergies.guardian !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.guardian < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SopyoJ32i8FzT1CPMpnKfw2Dks3jZIoY0aJtc7"}
                  width={60}
                  height={60}
                  alt="Guardian"
                />
                <div>
                  <p>Guardian</p>
                  <p>{synergies.guardian}/6</p>
                </div>
              </div>
            }


            {synergies.assassin !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.assassin < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8So63x3Q07mzgcx40Chv2prAtTlbN3V5ZdjXsDo"}
                  width={60}
                  height={60}
                  alt="Assassin"
                />
                <div>
                  <p>Assassin</p>
                  <p>{synergies.assassin}/4</p>
                </div>
              </div>
            }


            {synergies.shieldmaiden !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.shieldmaiden < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoUxD1U4O6DukTeBcSf0AJ27MLmRxrw8XPFYQs"}
                  width={60}
                  height={60}
                  alt="Shieldmaiden"
                />
                <div>
                  <p>Shieldmaiden</p>
                  <p>{synergies.shieldmaiden}/4</p>
                </div>
              </div>
            }


            {synergies.greedy !== 0 &&
              <div className="flex">
                <Image
                  className={`${synergies.greedy < 2 ? 'grayscale' : ''}`}
                  src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoyAltObj6iks3oEHVrTJLvxDaA9lmqhju0yR1"}
                  width={60}
                  height={60}
                  alt="Greedy"
                />
                <div>
                  <p>Greedy</p>
                  <p>{synergies.greedy}/8</p>
                </div>
              </div>
            }


          </div>
          {/* Synergies end */}

          {/* Board */}
          <div className="grid grid-cols-8 gap-2 w-[592px] h-[360px] border-solid rounded-md">
            {board.map((item, index) => (
              <Droppable id={index} key={index}>
                <div className="h-[80px] w-[70px] border-solid border-2 border-neutral rounded-md ">
                  {/* deck[index] is the id of the Draggable element that is on that deck slot */}
                  {/* board[index] -> titanId */}
                  {board[index] !== null ? titanCards[board[index].toString()] : null}
                </div>
              </Droppable>
            ))}
          </div>
          {/* Board end */}
        </div>


        {/* Deck: (Draggable Titans cards) */}


        <Droppable id="_deck">
          <div className="flex flex-wrap gap-3 bg-neutral w-[592px] h-[360px] rounded-md p-1 overflow-y-scroll">
            {Object.entries(deck).map(([key, value]) => (
              value != null ? <div key={key}>{value}</div> : null
            ))}
            {/* {deck.map((id, index) => (
              deck[index] !== null ? <div key={index}  >{

                titanCards[deck[index].toString()]

              }</div> : null
            ))} */}
          </div>
        </Droppable>
        {/* Deck end */}

        <DragOverlay>
          {draggedItem ? draggedItem : null}
        </DragOverlay>


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

// 3. Array of draggables: (deck): It can be more than 32 items
// [0, 1, 2, 3, 4, 5, ... , 31] 32 items
// every time an card is dragged to the board, it becomes null in that position.
// ex: [0, 1, 2, 3, null, 5, ... , 31]

// 4. Array of droppables: (board)
// [null, null, ... , null] 32 items






