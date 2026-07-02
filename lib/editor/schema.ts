export type ElementType = 'text' | 'image';

export interface ElementBase {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
}

export interface TextElement extends ElementBase {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align: 'left' | 'center' | 'right';
  fontStyle: 'normal' | 'bold' | 'italic' | 'bold italic';
  width: number;
}

export interface ImageElement extends ElementBase {
  type: 'image';
  src: string;
  width: number;
  height: number;
}

export type EditorElement = TextElement | ImageElement;

export interface TemplateData {
  id: string;
  name: string;
  width: number;
  height: number;
  background: string;
  elements: EditorElement[];
}
