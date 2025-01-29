"use client"
import { useDraggable } from '@dnd-kit/core';
import Image from "next/image"
import { useState } from 'react';
import { Tooltip } from 'react-tooltip'

export function ItemDraggable({ id, size, color, image_url, description, upgrade }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <>

            <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
                <div className='relative'>
                    <span
                        className='tooltip z-30 w-[30px] h-[40px]
                      absolute'
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={description +  upgrade}
                        data-tooltip-delay-show={1000}
                    >
                        <Tooltip id='my-tooltip'/>
                    </span>
                </div>
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
            </div>
        </>

    );
}