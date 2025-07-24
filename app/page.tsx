import { Todo } from '@/types/todo';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';

// Server-side data fetching dengan revalidation
async function getTodos(): Promise<Todo[]> {
  try {
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_start=0&_limit=10',
      {
        // Revalidate setiap 60 detik
        next: { revalidate: 60 }
      }
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch todos');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
}

export default async function HomePage() {
  const initialTodos = await getTodos();

  return (
    <div className="container max-w-3xl mx-auto my-5 space-y-2 bg-white rounded-xl divide-y divide-gray-300">
      <div className='p-4'>
        <h1 className='text-3xl font-bold'>Todo App - EZV Service Indonesia</h1>
        <p className='text-sm'>
          Built with Next.js App Router, Redux Toolkit & RTK Query
        </p>
      </div>
      <TodoForm />
      <TodoList initialTodos={initialTodos} />
    </div>
  );
}

// Metadata untuk SEO
export const metadata = {
  title: 'Todo List - EZV Service Indonesia',
  description: 'Manage your todos with our modern React application',
};