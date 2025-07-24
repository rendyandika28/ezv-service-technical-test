export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface CreateTodoRequest {
  userId: number;
  title: string;
  completed: boolean;
}

export interface PaginationParams {
  _start: number;
  _limit: number;
}