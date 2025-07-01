"use client";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useState } from "react";
import SortableItem from "./SortableItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CourseStructure = () => {
  const [items, setItems] = useState([1, 2, 3]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
};
export default CourseStructure;
