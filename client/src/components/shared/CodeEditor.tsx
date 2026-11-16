'use client';

import React, { useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
}: CodeEditorProps) {
  const lineCount = value.split('\n').length;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Reset cursor position
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-zinc-950 font-mono text-sm overflow-hidden">
      {/* Code Editor Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/80 px-4 py-2 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5 font-semibold text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {language.toUpperCase()}
        </span>
        <span>{readOnly ? 'READ ONLY' : 'EDITABLE'}</span>
      </div>

      {/* Editor Body */}
      <div className="flex flex-1 relative min-h-[240px]">
        {/* Line Numbers */}
        <div className="select-none border-r border-white/5 px-3.5 py-4 text-right text-zinc-600 bg-zinc-900/20">
          {Array.from({ length: Math.max(1, lineCount) }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className="flex-1 resize-none bg-transparent px-4 py-4 text-zinc-200 focus:outline-none focus:ring-0 leading-6 font-mono min-h-[240px]"
          placeholder="// Enter code here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
