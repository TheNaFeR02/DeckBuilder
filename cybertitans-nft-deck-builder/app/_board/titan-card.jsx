"use client"
import { useDraggable } from '@dnd-kit/core';
import { Droppable } from './deck-slot';
// import React from "react"

export function TitanCardDraggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: {
      "titanName": props.titanName,
      "titanId": props.titanId
    }
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  return (
    // <Droppable>
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}
        className='bg-transparent w-[70px] h-[80px] rounded-md'
      >
        {props.children}
      </div>
    // </Droppable>
  );
}

