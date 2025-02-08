// import { Draggable } from "@/app/_board/titan-card"
import Image from "next/image"
import { TitanCardDraggable } from "../_board/titan-card"


// Takes the info of a titan and converts it into a Draggable Card.
export function titanCard(image, name, id, titanId, cost) {
  return <TitanCardDraggable id={titanId} titanId={titanId} titanName={name}>
    <figure className="relative w-full h-full">
      <Image
        className="object-cover border-solid border-neutral border-2 rounded-md"
        src={image}
        alt={name}
        fill
        sizes="(max-width: 600px) 70px, (max-width: 1200px) 70px, 70px"
        // sizes="(max-width: 1200px) " 
      />
      <div className="bg-primary w-5 h-6 rounded-br-md  absolute top-0 rounded-tl-md  bottom-1"></div>
      <div className="text-white font-bold absolute top-0 left-0.5">${cost}</div>
      <p className="text-white absolute bottom-2 left-1 text-sm">{name}</p>
    </figure>
  </TitanCardDraggable>
}
