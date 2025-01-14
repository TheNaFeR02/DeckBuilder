// import { Draggable } from "@/app/_board/titan-card"
import Image from "next/image"
import { Draggable } from "../_board/titan-card"


// Takes the info of a titan and converts it into a Draggable Card.
export function titanCard(image, name, id) {
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
