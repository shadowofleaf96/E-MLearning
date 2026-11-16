'use client';

import React, { useState } from 'react';
import { Textarea } from '../ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content here...',
}: RichTextEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="w-full rounded-xl border border-white/10 bg-zinc-900/30 overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-950 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="rounded px-2.5 py-1 text-xs font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition"
            onClick={() => onChange(value + ' **bold**')}
          >
            B
          </button>
          <button
            type="button"
            className="rounded px-2.5 py-1 text-xs font-semibold italic text-zinc-400 hover:bg-white/5 hover:text-white transition"
            onClick={() => onChange(value + ' *italic*')}
          >
            I
          </button>
          <button
            type="button"
            className="rounded px-2.5 py-1 text-xs font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition"
            onClick={() => onChange(value + '\n# Heading')}
          >
            H1
          </button>
          <button
            type="button"
            className="rounded px-2.5 py-1 text-xs font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition"
            onClick={() => onChange(value + '\n- List item')}
          >
            List
          </button>
        </div>

        <div className="flex rounded-lg bg-zinc-900 p-0.5 border border-white/5">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              mode === 'edit'
                ? 'bg-emerald-500 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              mode === 'preview'
                ? 'bg-emerald-500 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[180px]">
        {mode === 'edit' ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[180px] w-full border-none bg-transparent p-0 text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        ) : (
          <div className="prose prose-invert max-w-none text-zinc-300 min-h-[180px] text-sm">
            {value ? (
              <div className="whitespace-pre-wrap">{value}</div>
            ) : (
              <span className="text-zinc-600 italic">Nothing to preview</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
