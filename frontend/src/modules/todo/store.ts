import { signal } from '@preact/signals';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const initialTodos: Todo[] = [
  {
    id: '1',
    title: 'Learn Preact Signals',
    description: 'Study how to use preact/signals for state management',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Create Todo App',
    description: 'Build a simple todo list application',
    completed: true,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    title: 'Add P2P Sync',
    description: 'Implement peer-to-peer synchronization for todos',
    completed: false,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
  },
];

export const todosSignal = signal<Todo[]>(initialTodos);

export const addTodo = (title: string, description?: string) => {
  const newTodo: Todo = {
    id: Date.now().toString(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  todosSignal.value = [...todosSignal.peek(), newTodo];
};

export const updateTodo = (id: string, updates: Partial<Todo>) => {
  const todos = todosSignal.peek();
  const index = todos.findIndex(todo => todo.id === id);
  
  if (index !== -1) {
    const updatedTodo = {
      ...todos[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    const newTodos = [...todos];
    newTodos[index] = updatedTodo;
    todosSignal.value = newTodos;
  }
};

export const deleteTodo = (id: string) => {
  todosSignal.value = todosSignal.peek().filter(todo => todo.id !== id);
};

export const toggleTodoCompletion = (id: string) => {
  const todo = getTodo(id);
  if (todo) {
    updateTodo(id, { completed: !todo.completed });
  }
};

export const getTodo = (id: string): Todo | undefined => {
  return todosSignal.peek().find(todo => todo.id === id);
};