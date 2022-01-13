import React from 'react'
import { useDrag } from 'react-dnd';

function Service({ draggable, id }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "component",
        item: {id: id},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    

    return <div ref={drag}>
        {draggable}
    </div>
}

export default Service
