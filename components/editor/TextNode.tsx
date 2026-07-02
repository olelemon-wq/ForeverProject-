import React, { useRef } from 'react';
import { Text } from 'react-konva';
import Konva from 'konva';
import { TextElement } from '@/lib/editor/schema';
import { useEditorStore } from '@/lib/editor/store';

interface TextNodeProps {
  element: TextElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<TextElement>) => void;
}

export default function TextNode({ element, isSelected, onSelect, onChange }: TextNodeProps) {
  const shapeRef = useRef<Konva.Text>(null);
  const { editingId, setEditingId } = useEditorStore();
  const isEditing = editingId === element.id;

  return (
    <Text
      ref={shapeRef}
      id={element.id}
      text={element.text}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily}
      fill={element.fill}
      align={element.align}
      fontStyle={element.fontStyle}
      width={element.width}
      opacity={isEditing ? 0 : element.opacity}
      draggable={!element.locked && !isEditing}
      onClick={onSelect}
      onTouchStart={onSelect}
      onDblClick={() => setEditingId(element.id)}
      onDblTap={() => setEditingId(element.id)}
      onDragEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        if (!node) return;
        
        const scaleX = node.scaleX();
        
        // Reset scales to keep rendering crisp and update dimension values
        node.scaleX(1);
        node.scaleY(1);
        
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(5, node.width() * scaleX),
          fontSize: Math.max(8, Math.round(element.fontSize * scaleX)),
        });
      }}
    />
  );
}
