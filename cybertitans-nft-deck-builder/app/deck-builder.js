"use client"
import Image from "next/image"
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useEffect, useState } from "react"
import { Droppable } from "./_board/deck-slot";
import { ItemDraggable } from "./_board/item";

const red = 'invert(22%) sepia(96%) saturate(5375%) hue-rotate(355deg) brightness(92%) contrast(121%)'
const blue = 'invert(8%) sepia(100%) saturate(7230%) hue-rotate(248deg) brightness(95%) contrast(144%)'
const yellow = 'invert(97%) sepia(56%) saturate(2855%) hue-rotate(333deg) brightness(101%) contrast(102%)'
const raygun = "https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SoSFPZW6K3v92ZMKfQFXw67dA1tHjUTIL5ycDO"
// temp items
// const itemsData = {
//   "item.raygun-1": <ItemDraggable id={"item.raygun-1"} size={45} image_url={raygun} color={red} />,
//   "item.raygun-2": <ItemDraggable id={"item.raygun-2"} size={45} image_url={raygun} color={blue} />,
//   "item.raygun-3": <ItemDraggable id={"item.raygun-3"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-4": <ItemDraggable id={"item.raygun-4"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-5": <ItemDraggable id={"item.raygun-5"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-6": <ItemDraggable id={"item.raygun-6"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-7": <ItemDraggable id={"item.raygun-7"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-8": <ItemDraggable id={"item.raygun-8"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-9": <ItemDraggable id={"item.raygun-9"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-10": <ItemDraggable id={"item.raygun-10"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-11": <ItemDraggable id={"item.raygun-11"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-12": <ItemDraggable id={"item.raygun-12"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-13": <ItemDraggable id={"item.raygun-13"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-14": <ItemDraggable id={"item.raygun-14"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-15": <ItemDraggable id={"item.raygun-15"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-16": <ItemDraggable id={"item.raygun-16"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-17": <ItemDraggable id={"item.raygun-17"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-18": <ItemDraggable id={"item.raygun-18"} size={45} image_url={raygun} color={yellow} />,
//   "item.raygun-19": <ItemDraggable id={"item.raygun-19"} size={45} image_url={raygun} color={yellow} />
// }

export default function DeckBuilder({
  titans,
  titanCards,
  itemsData
}) {
  const [board, setBoard] = useState(Array(32).fill(null)); // board would be a better name
  const [deck, setDeck] = useState(titanCards); // array of ids of the titans in the deck
  const [currentDraggableId, setCurrentDraggableId] = useState(null); // null || id of the draggable being dragged.
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null)
  const [synergies, setSynergies] = useState({ "oceanic": 0, "forest": 0, "magma": 0, "desert": 0, "humanoid": 0, "electric": 0, "arctic": 0, "holy": 0, "demon": 0, "spirit": 0, "indomitable": 0, "caster": 0, "shooter": 0, "weaponsMaster": 0, "guardian": 0, "assassin": 0, "shieldmaiden": 0, "greedy": 0 })
  const [currentDraggableTitanId, setCurrentDraggableTitanId] = useState(null)
  const [nameFilter, setNameFilter] = useState("")
  const [items, setItems] = useState(itemsData)
  const [itemsBoardSlots, setItemsBoardSlots] = useState(Array(32).fill([]))


  // useEffect(() => {
  //   setItemsBoardSlots((prev) => {
  //     const newSlots = prev.map(slot => [...slot]); // Create a deep copy of the nested arrays
  //     newSlots[1] = [...newSlots[1], itemsData["item.raygun-1"]]; // Add item to the second array
  //     console.log("newSlots", newSlots);
  //     return newSlots;
  //   })
  // }, [])

  useEffect(() => {
    console.log(itemsBoardSlots)
  })

  function handleDragEndItem(itemId, droppableSelected) {
    // 2. Item is placed on the items list. 
    // 2.1 From the same list - do nothing
    // 2.2 From the board. 
    setItems((prevItems) => ({
      ...prevItems,
      [itemId]: itemsData[itemId]
    }))

    setItemsBoardSlots((prevSlots) => {
      const newSlots = prevSlots.map(slot => [...slot]); // Create a deep copy of the nested arrays
      newSlots.forEach((slot, index) => {
        const pos = slot.indexOf(itemsData[itemId]);
        if (pos !== -1) {
          newSlots[index].splice(pos, 1);
        }
      });
      return newSlots;
    })

    if (droppableSelected === "_itemsList") {
      console.log(droppableSelected)
      return
    }
    // -------



    // 3. Normal case: Drag item to slot
    setItemsBoardSlots((prev) => {
      const newSlots = prev.map(slot => [...slot]);
      if (newSlots[droppableSelected].length < 3) {
        console.log("entro");
        newSlots[droppableSelected] = [...newSlots[droppableSelected], itemsData[itemId]];
        setItems((prevItems) => ({
          ...prevItems,
          [itemId]: null
        }));
        return newSlots;
      }
      return prev;
    });

  }

  function handleDragEnd(event) {
    const { over } = event; // null if not over a droppable or the droppable id if it is over a droppable.

    // 1. if the draggable is not over a droppable, we don't need to do anything.
    if (!over) {
      return;
    }

    // 2. if the draggable is over a droppable, we need to check if the droppable is the deck of cards or a slot on the board.
    // Now a titan card could be a droppable as well since they can have items.
    const droppableSelected = over.id

    console.log("droppable selected", droppableSelected)

    if (currentDraggableId.startsWith("item.")) {
      handleDragEndItem(currentDraggableId, droppableSelected)
      return
    }
    // TITAN CARD DRAGGABLE CARD HANDLER ↓

    // 3. if the droppable is not the deck of cards and the slot on the board is already occupied, we don't need to do anything.
    if (droppableSelected !== '_deck' && board[droppableSelected] !== null) {
      return;
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
    setDraggedCard(null);

    setDraggedItem(null)
  }

  function handleDragStart(event) {
    const { active } = event;
    // console.log(active)

    setCurrentDraggableId(active.id.toString());
    setDraggedItem(items[active.id.toString()])

    // active.id is the id of the draggable (titan card/item) being dragged.
    // We check if it's not an item.
    if (!active.id.toString().startsWith("item.")) {
      setCurrentDraggableTitanId(active.data.current.titanId)
      setDraggedCard(titanCards[active.id.toString()]);
    }

  }

  return (
    <DndContext
      id="draggable-table-01"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="h-screen flex gap-10 justify-center flex-col items-center">


        <div className="flex flex-wrap relative gap-3">
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
                <div className="h-[80px] w-[70px] relative border-solid border-2 border-neutral rounded-md flex justify-end items-end">
                  {/* board[index] -> titanId */}
                  {board[index] !== null ? titanCards[board[index].toString()] : null}
                  <div className="bg-neutral w-14 h-6 absolute -bottom-2.5 rounded-sm z-30">
                    {/* <Droppable id={`item.slot.${index}`}> */}
                    <div className="flex relative justify-center items-center">
                      {itemsBoardSlots[index].map((item, itemIndex) => (
                        <div key={itemIndex} className="w-7 h-7">{item}</div>
                      ))}
                    </div>
                    {/* </Droppable> */}
                  </div>
                </div>
              </Droppable>
            ))}
          </div>
          {/* Board end */}

          {/* Items */}
          <div className="flex flex-wrap relative ">

            <div className="absolute -right-48 w-48">
              <Droppable id="_itemsList">
                <div className="grid grid-cols-3 gap-2 border-2 border-solid border-neutral rounded-md h-[360px] overflow-y-scroll overflow-x-hidden">
                  {Object.entries(items).map(([key, value]) => (
                    value != null ? <div key={key}>{value}</div> : null
                  ))}
                </div>
              </Droppable>
            </div>

          </div>

          {/* Items end */}
        </div>

        {/* Deck: (Draggable Titans cards) */}
        <Droppable id="_deck">

          <div role="tablist" className="tabs tabs-lifted relative">
            <label className="input input-bordered absolute right-0 -top-6 flex items-center"
            >
              <input type="text" className="grow" placeholder="Search"
                onChange={(e) => setNameFilter(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd" />
              </svg>
            </label>

            <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="All" defaultChecked />

            <div role="tabpanel" className="tab-content  border-base-300 rounded-box p-3">
              <div className="flex flex-wrap gap-3 bg-neutral w-[570px] h-[360px] rounded-md p-1 overflow-y-scroll border-0">
                {nameFilter === "" ? (
                  Object.entries(deck).map(([key, value]) => (
                    value != null ? <div key={key}>{value}</div> : null
                  ))
                )
                  :
                  (
                    Object.entries(deck).map(([key, value]) => (
                      value != null && value.props.titanName.toLowerCase().includes(nameFilter.toLocaleLowerCase()) ? <div key={key}>{value}</div> : null
                    ))
                  )}
              </div>
            </div>

            {/* <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 2" />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              Tab content 2
            </div> */}

          </div>

        </Droppable>
        {/* Deck end */}

        <DragOverlay>
          {draggedCard ? draggedCard : null}
          {draggedItem ? draggedItem : null}
        </DragOverlay>





      </div>
    </DndContext>
  );
}







