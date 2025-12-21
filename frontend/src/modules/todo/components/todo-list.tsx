import { todosSignal, addTodo } from '../store';
import { For } from '@preact/signals/utils';
import { TodoItem } from './todo-item';
import { FormNewTodo } from './form-new-todo';


export function TodoList() {
  return (
    <div className="todo-module">
      <div className="todo-list">
        <h2>Todo List</h2>

        {/* <form onSubmit={handleAddTodo} className="add-todo-form">
          <input
            type="text"
            value={newTodoTitle}
            onChange={onInputTitle}
            placeholder="Add a new todo..."
            className="new-todo-input"
          />
          <textarea
            value={newTodoDescription}
            onChange={onInputDescription}
            placeholder="Description (optional)"
            className="new-todo-description"
          />
          <button type="submit" className="add-todo-button">Add Todo</button>
        </form> */}

        <FormNewTodo onAddTodo={addTodo} />

        <ul className="todo-items">
          <For each={todosSignal} fallback={<p>Нет элементов</p>}>
            {(todo) => <TodoItem todo={todo} />}
          </For>
          {/* {todosSignal.value.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <Link
                href={RouteNames.TODO_DETAIL.replace(':id', todo.id)}
                className="todo-link"
              >
                <h3>{todo.title}</h3>
                <p>{todo.description || 'No description'}</p>
                <small>
                  Created: {todo.createdAt.toLocaleDateString()}
                  {todo.completed ? ' ✓' : ' ○'}
                </small>
              </Link>
            </li>
          ))} */}
        </ul>
      </div>
    </div>
  );
}