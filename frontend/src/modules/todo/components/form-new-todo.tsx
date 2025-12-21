import { signal } from '@preact/signals';

interface FormNewTodoProps {
  onAddTodo: (title: string, description?: string) => void;
}

export function FormNewTodo({ onAddTodo }: FormNewTodoProps) {
  const newTodoTitle = signal('');
  const newTodoDescription = signal('');

  const handleAddTodo = (e: Event) => {
    e.preventDefault();

    const title = newTodoTitle.value.trim();
    if(!title) {
      return;
    }

    onAddTodo(title, newTodoDescription.value || undefined);
    newTodoTitle.value = '';
    newTodoDescription.value = '';
  };

  const onInputTitle = (e: Event) => {
    newTodoTitle.value = (e.target as HTMLInputElement).value;
  }

  const onInputDescription = (e: Event) => {
    newTodoDescription.value = (e.target as HTMLTextAreaElement).value;
  }

  return (
    <form onSubmit={handleAddTodo} className="add-todo-form">
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
    </form>
  );
}