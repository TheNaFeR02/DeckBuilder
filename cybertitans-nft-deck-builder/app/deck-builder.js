"use client"
import Image from "next/image"
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useEffect, useState } from "react"
import { Droppable } from "./_board/deck-slot";
import { useSession } from 'next-auth/react'
import { ItemDraggable } from "./_board/item";
import { persistBoard, persistItemsInBoard, persistSynergiesCounter, saveBuild } from "./actions";
import GoogleSignIn from "./(auth)/google/signin/google-signin";


export default function DeckBuilder({
  boardInit,
  titans,
  titanCards,
  deckInit,
  itemsData,
  itemBoardSlotsInit,
  synergiesInit,
}) {

  console.log("board init:", boardInit);

  const [board, setBoard] = useState(boardInit); // board would be a better name
  const [deck, setDeck] = useState(deckInit); // array of ids of the titans in the deck
  const [items, setItems] = useState(itemsData)
  const [itemsBoardSlots, setItemsBoardSlots] = useState(itemBoardSlotsInit)
  const [synergies, setSynergies] = useState(synergiesInit)

  const [currentDraggableId, setCurrentDraggableId] = useState(null); // null || id of the draggable being dragged.
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null)
  const [currentDraggableTitanId, setCurrentDraggableTitanId] = useState(null)
  const [nameFilter, setNameFilter] = useState("")
  const [buildName, setBuildName] = useState("")
  const [showAlert, setShowAlert] = useState(false) // When the build is saved successfully!.
  const [showErrorAlert, setShowErrorAlert] = useState(false)


  // crystals counter
  const [lethal, setLethal] = useState(1)
  const [ultimate, setUltimate] = useState(1)
  const [fortune, setFortune] = useState(1)


  const { data: session } = useSession()

  useEffect(() => { }, [board])


  async function handleSave(buildName) {
    // Saving itemBoardSlots
    let persistedSlots = {}
    itemsBoardSlots.forEach((slots, i) => {
      persistedSlots[i] = []
      if (slots.length !== 0) {
        slots.forEach((item, j) => {
          persistedSlots[i].push(item.props)
        })
      }
    })

    const sanitizedBoard = board.map(item => item === null ? '' : item);

    try {

      if (session.user) {
        await saveBuild(buildName, session.user, persistedSlots, synergies, sanitizedBoard)
        // Show the alert
        setShowAlert(true);

        // Hide the alert after 3 seconds
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }



    } catch (e) {
      console.log("there was an error saving the build", e);

      setShowErrorAlert(true)

      setTimeout(() => {
        setShowErrorAlert(false)
      }, 3000)


    }



    // persistItemsInBoard(persistedSlots)

    // Saving synergies counter.
    // persistSynergiesCounter(synergies) 


    // persistBoard(board)

    // // Board and deck persist.
    // let persistedTitanSlots = {}
    // board.forEach((titanId, index) => {
    //   persistedTitanSlots[index] = {}
    //   if (titanId !== null) {
    //     persistedTitanSlots[index] = titanId
    //   }
    // })

    // console.log(persistedTitanSlots)


    // // persistDeck(deck)
  }

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

          // If the item was a synergy and placed back in the list, we subtract the two +2 points.
          const _synergy = itemId.split(".")[1]
          setSynergies((prevSynergies) => ({
            ...prevSynergies,
            [_synergy.toLowerCase()]: (prevSynergies[_synergy.toLowerCase()] || 0) - 2
          }))
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
        newSlots[droppableSelected] = [...newSlots[droppableSelected], itemsData[itemId]];
        setItems((prevItems) => ({
          ...prevItems,
          [itemId]: null
        }));

        // In case the item was a synergy we need to add +2 points to the synergies on the board.
        const _synergy = itemId.split(".")[1]
        setSynergies((prevSynergies) => ({
          ...prevSynergies,
          [_synergy.toLowerCase()]: (prevSynergies[_synergy.toLowerCase()] || 0) + 2
        }))

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

    if (currentDraggableId.startsWith("item.") && droppableSelected !== '_deck') {
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
        {/* Green/successful alert when build was saved */}
        {showAlert && (
          <div role="alert" className="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your build has been saved!</span>
          </div>
        )}

        {/*  Error alert when build had an error when saving*/}
        {showErrorAlert && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error! there was an error when saving the build. Try again later.</span>
          </div>
        )}

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
            {board.map((titanId, index) => (
              <Droppable id={index} key={index}>
                <div className="h-[80px] w-[70px] relative border-solid border-2 border-neutral rounded-md flex justify-end items-end">
                  {/* board[index] -> titanId */}
                  {board[index] !== null ? titanCards[titanId] : null}
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
          <div className="flex flex-wrap relative">

            <div className="absolute -right-48 w-48">
              <Droppable id="_itemsList">
                <div className="relative grid grid-cols-3 gap-2 border-2 border-solid border-neutral rounded-md h-[360px] overflow-y-scroll overflow-x-hidden">
                  {Object.entries(items).map(([key, value]) => (
                    value != null ? <div key={key} className="relative w-[60px] h-[60px] flex items-center justify-center">{value}</div> : null
                  ))}
                </div>
              </Droppable>
            </div>

          </div>

          {/* Items end */}
        </div>


        {session?.user ?
          (
            <div className="w-[592px]">
              {/* <button onClick={handleSave} className="btn btn-accent float-right">Save</button> */}
              {/* Open the modal using document.getElementById('ID').showModal() method */}

              <button className="btn btn-accent float-right" onClick={() => document.getElementById('my_modal_1').
                // @ts-ignore
                showModal()}>✔️ Save</button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box ">
                  <h3 className="font-bold text-lg">Select a name for your build.</h3>
                  <input type="text" placeholder="Build name" className="input input-bordered w-full max-w-xs my-10" onChange={(e) => setBuildName(e.target.value)} value={buildName} />
                  <div className="modal-action flex-end">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">Close</button>
                      <button onClick={() => handleSave(buildName)} className="btn btn-accent mx-3">submit</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          ) : (
            <div className="w-[592px]">
              <button className="btn btn-accent float-right" onClick={() => document.getElementById('my_modal_2').
                // @ts-ignore
                showModal()}>✔️ Save</button>
              <dialog id="my_modal_2" className="modal">
                <div className="modal-box p-0 w-auto">
                  <GoogleSignIn />
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
          )}


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

            <div className="absolute border-2 border-neutral w-48 h-72 top-10 -right-52 rounded-md">
              <div className="border-b border-neutral w-full h-1/3 flex justify-center flex-col">
                <div className=" flex justify-between w-full h-1/3 px-3 pt-3">
                  <div><p className="pl-2">Lethal</p></div>
                  <div className="tooltip"
                    data-tip={`
                    ${lethal === 1 ? 'All allied Titans get:- 200 Health - 10 Damage - 10 Cyber Damage' : ''}
                    ${lethal === 2 ? 'All allied Titans get:- 400 Health - 25 Damage - 25 Cyber Damage' : ''}
                    ${lethal === 3 ? 'All allied Titans get: - 800 Health - 55 Damage - 55 Cyber Damage - 25% Attack Speed' : ''}
                    `}><button>？</button></div>
                </div>
                <div onClick={() => lethal < 3 ? setLethal(lethal + 1) : setLethal(1)} className="h-2/3 flex justify-center items-center cursor-pointer">
                  <Image
                    src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8SosUepbAqTWUSK2JEixcptvqBydGCjl5aP63RN"}
                    alt="lethal"
                    width={40}
                    height={40}
                  />
                  <div ><p>{lethal}</p></div>
                </div>
              </div>
              <div className="border-b border-neutral w-full h-1/3 flex justify-center flex-col cursor-pointer">

                <div className=" flex justify-between w-full h-1/3 px-3 pt-3">
                  <div><p className="pl-2">Ultimate</p></div>
                  <div className="tooltip"
                    data-tip={`
                    ${ultimate === 1 ? 'All allied Titans get - 2% Max Health restore per second - 2% Max Charge restore per second' : ''}
                    ${ultimate === 2 ? 'All allied Titans get - 4% Max Health restore per second - 4% Max Charge restore per second' : ''}
                    ${ultimate === 3 ? 'All allied Titans get - 9% Max Health restore per second - 9% Max Charge restore per second - 25% Attack Speed' : ''}
                  `}
                  ><button>？</button></div>
                </div>
                <div onClick={() => ultimate < 3 ? setUltimate(ultimate + 1) : setUltimate(1)} className="h-2/3 flex justify-center items-center">
                  <Image
                    src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8Sor55bI8A8KJ9tlvuHNaxjn3YTIi6pLDkz4BGP"}
                    alt="ultimate"
                    width={40}
                    height={40}
                  />
                  <div className=""><p>{ultimate}</p></div>
                </div>

              </div>

              <div className="border-b border-neutral w-full h-1/3 flex justify-center flex-col cursor-pointer" >

                <div className=" flex justify-between w-full h-1/3 px-3 pt-3">
                  <div><p className="pl-2">Fortune</p></div>
                  <div className="tooltip" data-tip={`
                    ${fortune === 1 ? '- 1 Extra Titan on the field' : ''}
                    ${fortune === 2 ? '- 25 coins - 2 random Items' : ''}
                    ${fortune === 3 ? '- The player gets +3 health - All enemy players get -3 health' : ''}
                  `}>
                    <button>？</button></div>
                </div>
                <div onClick={() => fortune < 3 ? setFortune(fortune + 1) : setFortune(1)}
                  className="h-2/3 flex justify-center items-center">
                  <Image
                    src={"https://jy37vuigv8.ufs.sh/f/AA3xkTQET8So4FYitgLAaMHXiFszTCKRWflpJGu5ODeQNEgd"}
                    alt="ultimate"
                    width={40}
                    height={40}
                  />
                  <div className=""><p>{fortune}</p></div>
                </div>
              </div>
            </div>
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







