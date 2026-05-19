'use client';
import { useState, useEffect } from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('everyday-tasks');
    if (saved) setTasks(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  // 2. Save to LocalStorage whenever tasks change (including reordering!)
  useEffect(() => {
    if (isLoaded) localStorage.setItem('everyday-tasks', JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    // Add to top of the list
    setTasks([{ id: Date.now().toString(), text: newTask, completed: false }, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (window.showToast) window.showToast('Task deleted');
  };

  if (!isLoaded) return <div className="animate-pulse text-neutral-500">Loading tasks...</div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Task List</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Manage priorities. Drag to reorder. Saved locally.</p>
      
      {/* Input Form */}
      <form onSubmit={addTask} className="flex gap-3 mb-10">
        <input 
          autoFocus
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="What needs to be done?"
          className="flex-1 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111] focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 transition-all text-neutral-900 dark:text-white"
        />
        <button 
          type="submit" 
          disabled={!newTask.trim()}
          className="px-8 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </form>

      {/* Drag and Drop Task List */}
      <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        {tasks.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 dark:text-neutral-600 flex flex-col items-center">
            <span className="text-4xl mb-4">☕</span>
            <p className="font-medium">No tasks pending. You're all caught up!</p>
          </div>
        ) : (
          <Reorder.Group 
            axis="y" 
            values={tasks} 
            onReorder={setTasks} 
            className="flex flex-col"
          >
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <Reorder.Item 
                  key={task.id} 
                  value={task}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex items-center p-4 border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 bg-white dark:bg-[#111] cursor-grab active:cursor-grabbing hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors"
                >
                  {/* Grip Icon for Dragging */}
                  <div className="mr-4 text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 transition-colors">
                    <svg width="16" height="24" viewBox="0 0 16 24" fill="currentColor">
                      <circle cx="6" cy="6" r="2"/><circle cx="10" cy="6" r="2"/>
                      <circle cx="6" cy="12" r="2"/><circle cx="10" cy="12" r="2"/>
                      <circle cx="6" cy="18" r="2"/><circle cx="10" cy="18" r="2"/>
                    </svg>
                  </div>

                  {/* Checkbox (Stop propagation so clicking it doesn't trigger a drag) */}
                  <div onPointerDown={(e) => e.stopPropagation()} className="flex items-center flex-1 gap-4">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 flex items-center justify-center rounded-md border-2 transition-all ${task.completed ? 'bg-neutral-900 border-neutral-900 dark:bg-white dark:border-white text-white dark:text-neutral-900' : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-900 dark:hover:border-white'}`}
                    >
                      {task.completed && (
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1.5 5.5 5 9 12.5 1.5"></polyline>
                        </svg>
                      )}
                    </button>
                    
                    <span className={`text-lg font-medium transition-all ${task.completed ? 'line-through text-neutral-400 dark:text-neutral-600' : 'text-neutral-800 dark:text-neutral-200'}`}>
                      {task.text}
                    </span>
                  </div>

                  {/* Delete Button (Stop propagation to prevent dragging) */}
                  <div onPointerDown={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => deleteTask(task.id)} 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </div>
    </div>
  );
}