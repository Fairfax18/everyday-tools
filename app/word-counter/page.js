'use client';
import { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  // Calculations
  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Avg reading speed is ~200 words per minute

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Word & Character Counter</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm uppercase tracking-wide">Words</p>
            <p className="text-3xl font-bold text-blue-600">{wordCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm uppercase tracking-wide">Characters</p>
            <p className="text-3xl font-bold text-blue-600">{charCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm uppercase tracking-wide">Reading Time</p>
            <p className="text-3xl font-bold text-blue-600">{readingTime} <span className="text-sm font-normal">min</span></p>
          </div>
        </div>

        <textarea
          className="w-full h-64 p-4 rounded-xl shadow-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y transition"
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        
        {text.length > 0 && (
          <button 
            onClick={() => setText('')}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
          >
            Clear Text
          </button>
        )}
      </div>
    </div>
  );
}