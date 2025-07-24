import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Todo, CreateTodoRequest, PaginationParams } from '@/types/todo';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com',
  }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], PaginationParams>({
      query: ({ _start, _limit }) => `/todos?_start=${_start}&_limit=${_limit}`,
      providesTags: ['Todo'],
    }),
    getAllTodos: builder.query<Todo[], void>({
      query: () => '/todos',
      providesTags: ['Todo'],
    }),
    createTodo: builder.mutation<Todo, CreateTodoRequest>({
      query: (newTodo) => ({
        url: '/todos',
        method: 'POST',
        body: newTodo,
      }),
      // Optimistic update: unshift new todo to the beginning of list
      async onQueryStarted(newTodo, { dispatch, queryFulfilled }) {
        // Create optimistic todo with temporary ID
        const optimisticTodo: Todo = {
          ...newTodo,
          id: Date.now(), // Temporary unique ID
        };

        // Update cache for paginated queries
        const patchResults: any[] = [];
        
        // Update first page (where new todo should appear)
        const firstPagePatch = dispatch(
          todoApi.util.updateQueryData('getTodos', { _start: 0, _limit: 10 }, (draft) => {
            draft.unshift(optimisticTodo);
            // Keep only 10 items for pagination
            if (draft.length > 10) {
              draft.pop();
            }
          })
        );
        patchResults.push(firstPagePatch);

        try {
          // Wait for the actual API call to complete
          const { data: createdTodo } = await queryFulfilled;
          
          // Update the optimistic todo with real data from server
          dispatch(
            todoApi.util.updateQueryData('getTodos', { _start: 0, _limit: 10 }, (draft) => {
              const todoIndex = draft.findIndex(todo => todo.id === optimisticTodo.id);
              if (todoIndex !== -1) {
                draft[todoIndex] = createdTodo;
              }
            })
          );
        } catch {
          // If API call fails, revert the optimistic update
          patchResults.forEach((patch) => patch.undo());
        }
      },
    }),
  }),
});

export const { 
  useGetTodosQuery, 
  useGetAllTodosQuery,
  useCreateTodoMutation 
} = todoApi;