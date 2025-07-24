'use client';

import { useState } from 'react';
import { useGetTodosQuery } from '@/lib/todoApi';
import { Todo } from '@/types/todo';

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const start = (currentPage - 1) * itemsPerPage;

  const { 
    data: todos = initialTodos, 
    error, 
    isLoading,
    refetch 
  } = useGetTodosQuery(
    { _start: start, _limit: itemsPerPage },
    {
      // Revalidate setiap 30 detik
      pollingInterval: 30000,
    }
  );

  const totalPages = Math.ceil(200 / itemsPerPage); // JSONPlaceholder has 200 todos

  if (isLoading && !todos.length) {
    return <div className="loading">Loading todos...</div>;
  }

  if (error) {
    return (
      <div className="error">
        Error loading todos. 
        <button onClick={() => refetch()} style={{ marginLeft: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='p-4'>
      <div className="todo-list">
        <h2 className='uppercase text-sm font-bold mb-5'>
          Todo List (Page {currentPage})
        </h2>
        <div className='space-y-3'>
          {todos.map((todo, index) => (
            <div
              key={`${todo.id}-${index}`}
              className={`todo-item flex flex-row justify-between border-b border-gray-200 pb-2 ${todo.completed ? 'completed' : ''}`}
            >
              <div>
                {todo.title}
              </div>
              <div>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  background: todo.completed ? '#d4edda' : '#fff3cd',
                  color: todo.completed ? '#155724' : '#856404'
                }}>
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row justify-center gap-2 mt-4">
        <button
        className='bg-gray-300 px-2 rounded-2xl text-xs font-bold uppercase'
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <span>
          Page {currentPage} of {totalPages}
        </span>
        
        <button
        className='bg-gray-300 px-2 rounded-2xl text-xs font-bold uppercase'
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}