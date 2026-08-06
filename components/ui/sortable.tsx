'use client';

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface SortableProps {
  value: UniqueIdentifier[];
  onValueChange: (value: UniqueIdentifier[]) => void;
  children: React.ReactNode;
  className?: string;
}

function Sortable({ value, onValueChange, children, className }: SortableProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = value.indexOf(active.id);
      const newIndex = value.indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      onValueChange(arrayMove(value, oldIndex, newIndex));
    },
    [onValueChange, value],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={value} strategy={verticalListSortingStrategy}>
        <div className={className}>{children}</div>
      </SortableContext>
    </DndContext>
  );
}

interface SortableItemProps {
  id: UniqueIdentifier;
  children: (props: {
    setActivatorNodeRef: (node: HTMLButtonElement | null) => void;
    dragHandleProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  }) => React.ReactNode;
  className?: string;
}

function SortableItem({ id, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
  };

  const dragHandleProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    type: 'button',
    ...attributes,
    ...listeners,
    onPointerDown: (event) => {
      event.stopPropagation();
      listeners?.onPointerDown?.(event);
    },
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && 'relative z-50', className)}
    >
      {children({ setActivatorNodeRef, dragHandleProps })}
    </div>
  );
}

export { Sortable, SortableItem };
