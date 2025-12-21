import { TodoList } from './components/todo-list';

export function TodoModule() {
  return (
    <div className="todo-module">
      <div className="todo-list">
        <h2>Todo List</h2>
      </div>
      <TodoList />
    </div>
  );
}