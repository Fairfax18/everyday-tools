'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(`# Welcome to your Markdown Editor

Start typing in the left pane. You can use:

- **Bold** or *Italic* text
- Lists like this
- Code blocks like \`const x = 10;\`

## Rendering Engine
The right pane updates in real-time.`);

  // A very lightweight, custom Markdown-to-HTML parser 
  // (In a production app, you might use 'react-markdown', but this works for pure client-side)
  const renderMarkdown = (text) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/`(.*)`/gim, '<code class="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono text-sm">$1</code>')
      .replace(/\n$/gim, '<br />');
  };

  const copyHtml = () => {
    const html = renderMarkdown(markdown);
    navigator.clipboard.writeText(html);
    if (window.showToast) window.showToast('HTML copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Markdown Editor</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Live preview Markdown editor.</p>
        </div>
        <button 
          onClick={copyHtml}
          className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold rounded-lg hover:scale-105 transition"
        >
          Copy HTML
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 h-[600px]">
        {/* Editor Pane */}
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-full p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition"
          placeholder="Write your markdown here..."
        />

        {/* Preview Pane */}
        <div 
          className="w-full h-full p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0a0a0a] overflow-auto prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
        />
      </div>
    </div>
  );
}