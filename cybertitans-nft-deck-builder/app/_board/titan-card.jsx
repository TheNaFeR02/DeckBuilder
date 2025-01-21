"use client"
import {useDraggable} from '@dnd-kit/core';
// import React from "react"

export function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
    data: {
      "titanId": props.titanId
    }
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
    className='bg-transparent w-[70px] h-[80px] rounded-md'
    >
      {props.children}
    </div>
  );
}

