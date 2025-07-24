'use client';

import { useState } from 'react';
import { useCreateTodoMutation } from '@/lib/todoApi';

export default function TodoForm() {
  const [title, setTitle] = useState('');
  const [createTodo, { isLoading }] = useCreateTodoMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTodo({
        userId: 1,
        title: title.trim(),
        completed: false,
      }).unwrap();
      
      setTitle('');
    } catch (error) {
      console.error('Failed to create todo:', error);
      alert('Failed to create todo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className='uppercase text-sm font-bold mb-3'>Add New Todo</h2>
      <div className='flex flex-row'>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title..."
          disabled={isLoading}
          className='border border-gray-300 rounded-l-lg p-2 flex-1'
        />
        <button className='w-fit px-4 bg-gray-600 rounded-r-lg text-sm text-white' type="submit" disabled={isLoading || !title.trim()}>
          {isLoading ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
}