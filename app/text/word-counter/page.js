'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Common English filler words to ignore in keyword analysis
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 
  'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 
  'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 
  'with', 'he', 'she', 'we', 'you', 'i', 'my', 'your', 'our', 'his', 'her', 
  'its', 'from', 'about', 'which', 'who', 'what', 'how', 'why', 'when', 'where',
  'can', 'could', 'would', 'should', 'has', 'have', 'had', 'been', 'do', 'does', 'did'
]);

export default function WordCounter() {
  const [text, setText] = useState('');

  // --- Core Metrics ---
  const metrics = useMemo(() => {
    const charCount = text.length;
    // Split by whitespace and filter out empty strings
    const wordsArray = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = wordsArray.length;
    
    // Average reading speed: 200-250 wpm. Speaking speed: 130-150 wpm.
    const readTime = Math.max(1, Math.ceil(wordCount / 225));
    const speakTime = Math.max(1, Math.ceil(wordCount / 140));

    return { charCount, wordCount, wordsArray, readTime, speakTime };
  }, [text]);

  // --- Keyword Density Analyzer ---
  const density = useMemo(() => {
    if (metrics.wordCount === 0) return [];

    const frequencyMap = {};
    let totalValidWords = 0;

    metrics.wordsArray.forEach(word => {
      // Clean the word: lowercase, remove punctuation
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Only count words longer than 2 characters that aren't in the stop list
      if (cleanWord.length > 2 && !STOP_WORDS.has(cleanWord)) {
        frequencyMap[cleanWord] = (frequencyMap[cleanWord] || 0) + 1;
        totalValidWords++;
      }
    });

    // Convert to array, sort by frequency, take top 10
    const sortedKeywords = Object.entries(frequencyMap)
      .map(([word, count]) => ({
        word,
        count,
        percentage: totalValidWords > 0 ? ((count / totalValidWords) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return sortedKeywords;
  }, [metrics.wordsArray, metrics.wordCount]);

  const clearText = () => {
    setText('');
    if (window.showToast) window.showToast('Text cleared');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Word & SEO Counter</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Count words, estimate speaking times, and analyze keyword density.</p>
      
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: Input Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Words', value: metrics.wordCount },
              { label: 'Characters', value: metrics.charCount },
              { label: 'Read Time', value: `${metrics.readTime} min` },
              { label: 'Speak Time', value: `${metrics.speakTime} min` },
            ].map((metric) => (
              <div key={metric.label} className="p-4 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Text Editor */}
          <div className="relative bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[400px]">
            <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/30">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Content</label>
              {text && (
                <button onClick={clearText} className="text-xs font-medium text-neutral-400 hover:text-red-500 transition-colors">Clear text</button>
              )}
            </div>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article, essay, or video script here..."
              className="flex-1 w-full p-5 bg-transparent outline-none resize-none text-neutral-800 dark:text-neutral-200 leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: Keyword Density Dashboard */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm sticky top-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Keyword Density</h2>
            
            {density.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400">
                <span className="text-4xl mb-3">📊</span>
                <p className="text-sm font-medium">Type or paste text to see keyword analysis.</p>
                <p className="text-xs mt-2 opacity-70">Common filler words are automatically ignored.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {density.map((item, index) => (
                  <motion.div 
                    key={item.word} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 truncate pr-4">{item.word}</span>
                      <div className="text-xs font-mono text-neutral-500 flex items-center gap-2">
                        <span>{item.count}x</span>
                        <span className="font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">{item.percentage}%</span>
                      </div>
                    </div>
                    {/* Visual Bar Chart */}
                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${Math.min(100, item.percentage * 3)}%` }} // Multiplied purely for visual scaling
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}