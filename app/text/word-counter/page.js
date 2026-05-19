'use client';
import { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Word Counter</h1>
      <p className="text-neutral-500 mb-8">Count words, characters, and estimate reading time.</p>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white border border-neutral-200 rounded-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Words</p>
          <p className="text-3xl font-bold text-neutral-900">{wordCount}</p>
        </div>
        <div className="p-4 bg-white border border-neutral-200 rounded-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Characters</p>
          <p className="text-3xl font-bold text-neutral-900">{charCount}</p>
        </div>
        <div className="p-4 bg-white border border-neutral-200 rounded-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Read Time</p>
          <p className="text-3xl font-bold text-neutral-900">{readingTime} <span className="text-sm font-normal text-neutral-500">min</span></p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-64 p-5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition resize-y text-neutral-800 leading-relaxed"
      />
      
      {text && (
        <button 
          onClick={() => setText('')}
          className="mt-4 px-6 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
        >
          Clear Text
        </button>
      )}
    </div>
  );
}