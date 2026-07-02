import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { TextElement } from '@/lib/editor/schema';

export default function TextEditorOverlay() {
  const { elements, editingId, updateElement, setEditingId } = useEditorStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const element = elements.find((el) => el.id === editingId) as TextElement | undefined;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      
      // Auto-height adjustment
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editingId]);

  if (!element || element.type !== 'text') return null;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    updateElement(element.id, { text: val });
    
    // Auto-height adjustment
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleBlur = () => {
    setEditingId(null);
  };

  // Convert font style representation
  const isBold = element.fontStyle?.includes('bold') || false;
  const isItalic = element.fontStyle?.includes('italic') || false;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    minHeight: `${element.fontSize * 1.2}px`,
    fontSize: `${element.fontSize}px`,
    fontFamily: element.fontFamily,
    color: element.fill,
    textAlign: element.align || 'center',
    transform: `rotate(${element.rotation || 0}deg)`,
    transformOrigin: 'top left',
    background: 'transparent',
    border: '1px dashed #10b981',
    outline: 'none',
    resize: 'none',
    overflow: 'hidden',
    lineHeight: '1.25',
    padding: '0',
    margin: '0',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    zIndex: 1000,
  };

  return (
    <textarea
      ref={textareaRef}
      value={element.text}
      onChange={handleTextChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      style={style}
      className="absolute focus:ring-0 focus:outline-none"
    />
  );
}
