import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import { useEditorStore } from '@/lib/editor/store';
import TextNode from './TextNode';
import TextEditorOverlay from './TextEditorOverlay';

export default function EditorCanvas() {
  const {
    elements,
    selectedId,
    canvasWidth,
    canvasHeight,
    background,
    updateElement,
    setSelectedId,
    clearSelection,
  } = useEditorStore();

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (background && (background.startsWith('/') || background.startsWith('http') || background.startsWith('data:'))) {
      const img = new window.Image();
      img.src = background;
      img.onload = () => {
        setBgImage(img);
      };
      img.onerror = () => {
        setBgImage(null);
      };
    } else {
      setBgImage(null);
    }
  }, [background]);

  useEffect(() => {
    if (selectedId && transformerRef.current && stageRef.current) {
      const selectedNode = stageRef.current.findOne('#' + selectedId);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, elements]);

  const handleStageClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'canvas-bg';
    if (clickedOnEmpty) {
      clearSelection();
    }
  };

  return (
    <div className="border border-stone-200 rounded-3xl overflow-hidden bg-stone-100/50 flex items-center justify-center p-6 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] select-none">
      <div className="shadow-lg border border-stone-200/80 rounded-2xl overflow-hidden bg-white relative">
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleStageClick}
          onTouchEnd={handleStageClick}
        >
          <Layer>
            {/* Background Layer */}
            {bgImage ? (
              <KonvaImage
                name="canvas-bg"
                image={bgImage}
                x={0}
                y={0}
                width={canvasWidth}
                height={canvasHeight}
              />
            ) : (
              <Rect
                name="canvas-bg"
                x={0}
                y={0}
                width={canvasWidth}
                height={canvasHeight}
                fill={background || '#ffffff'}
              />
            )}

            {elements.map((el) => {
              if (el.type === 'text') {
                return (
                  <TextNode
                     key={el.id}
                     element={el}
                     isSelected={el.id === selectedId}
                     onSelect={() => setSelectedId(el.id)}
                     onChange={(updates) => updateElement(el.id, updates)}
                  />
                );
              }
              return null;
            })}

            {selectedId && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
        <TextEditorOverlay />
      </div>
    </div>
  );
}
