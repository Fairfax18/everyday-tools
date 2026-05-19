'use client';
import { useState, useEffect } from 'react';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('everyday-tasks');
    if (saved) setTasks(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever tasks change
  useEffect(() => {
    if (isLoaded) localStorage.setItem('everyday-tasks', JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now(), text: newTask, completed: false }, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  if (!isLoaded) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Task List</h1>
      <p className="text-neutral-500 mb-8">Manage your daily priorities. Saved locally.</p>
      
      <form onSubmit={addTask} className="flex gap-2 mb-8">
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="What needs to be done?"
          className="flex-1 p-3 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
        />
        <button type="submit" className="px-6 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition">Add</button>
      </form>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-neutral-400 text-center py-8 border border-dashed border-neutral-200 rounded-lg">No tasks pending. You're all caught up!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg bg-white group hover:border-neutral-300 transition">
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleTask(task.id)} 
                  className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                />
                <span className={`${task.completed ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                  {task.text}
                </span>
              </label>
              <button onClick={() => deleteTask(task.id)} className="text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}