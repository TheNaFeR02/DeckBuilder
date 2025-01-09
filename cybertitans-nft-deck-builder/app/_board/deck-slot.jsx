import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function Droppable(props) {
    const { setNodeRef } = useDroppable({
        id: props.id,
    });

    return (
        <div ref={setNodeRef}
            className="h-[80px] w-[70px] border-solid border-2 border-neutral rounded-md"
        >
            {props.children}
        </div>
    );
}
