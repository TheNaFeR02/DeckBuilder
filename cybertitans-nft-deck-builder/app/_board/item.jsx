"use client"
import { useDraggable } from '@dnd-kit/core';
import Image from "next/image"

export function ItemDraggable({id, size, color, image_url}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;


    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}
        // className='bg-transparent w-[70px] h-[80px] rounded-md'
        >
            <Image
                style={{
                    filter: color,
                    height: "auto",
                    width: "auto"
                }}
                src={image_url}
                // CSS filter generator to convert from black to target hex color: https://codepen.io/sosuke/pen/Pjoqqp
                // It works to give color to a .png image
                // #ff0000
                width={size}
                height={size}
                alt={id}
            />
            {/* {children} */}
        </div>
    );
}