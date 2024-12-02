/*
    Theta Components for Status Page
    ©2024 L-mbda. Open source under the MPL-v2 license.
*/
'use client';

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
arrayMove,
SortableContext,
sortableKeyboardCoordinates,
useSortable,
verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BadgeCheck, HeartPulse } from "lucide-react";
  
// Create interfaces
interface Service {
    id: string,
    name: string,
    monitorType: string,
    heartbeatInterval: number;
}

interface servicesGroup {
    services: Service[]
}

export function DragDropServices({services}: servicesGroup) {
    // Define state
    const [items, setItems] = useState(services);

    // Handling sensors
    const sensor = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    )

    // Handling once item is dropped
    const handleDragEnd = (event: any) => {
        const {active, over} = event;

        // Check if not same ids and then set items into the items state
        if (active.id !== over.id) {
            // Set items and send PATCh request
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                fetch('/api/leorio', {
                    method: 'PATCH',
                    body: JSON.stringify({
                      services: newItems
                    })
                });          
                return newItems;
            })
        }
    }
    

    // Return drag and drop context
    return (
        <DndContext sensors={sensor} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="flex flex-col gap-3">
                {/* Map with keys */}
                {items.map((service) => (
                    // Sortable context
                    <SortableContext key={service.id} items={items} strategy={verticalListSortingStrategy}>
                        {/* Render Draggable Component */}
                        <ServiceItem key={service.id} id={service.id} service={service} />
                    </SortableContext>
                ))}
            </div>
        </DndContext>
    )
}

function ServiceItem({id, service}: {id: string, service: Service}) {
    // Define state and props
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    // Set up CSS
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    // Return component with service identities
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
        // Styles
        className="divPlaceholderBG p-4 shadow-sm rounded-lg flex flex-col gap-5 min-h-[20vh]">
            <h1 className="font-bold text-[20px]">{service.name}</h1>
            <div className="flex flex-row gap-3">
                <p className="flex flex-row justify-center items-center gap-1"><BadgeCheck /> {service.monitorType}</p>
                <p className="flex flex-row justify-center items-center gap-1"><HeartPulse /> {service.heartbeatInterval} second(s)</p>
            </div>

        </div>
    )
}