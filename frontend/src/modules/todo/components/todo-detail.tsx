import { useState, useEffect } from 'preact/hooks';
import { useRoute } from 'wouter-preact';
import { getTodo, updateTodo, deleteTodo, toggleTodoCompletion, type Todo } from '../store';

export function TodoDetail() {
  const [, params] = useRoute('/todo/:id');
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const todoId = params?.id;
    if (todoId) {
      const foundTodo = getTodo(todoId);
      if (foundTodo) {
        setTodo(foundTodo);
        setTitle(foundTodo.title);
        setDescription(foundTodo.description || '');
      }
    }
  }, [params]);

  const handleSave = () => {
    if (todo) {
      updateTodo(todo.id, { title, description });
      setIsEditing(false);
    }
  };

  const handleToggleCompletion = () => {
    if (todo) {
      toggleTodoCompletion(todo.id);
    }
  };

  const handleDelete = () => {
    if (todo && confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(todo.id);
      window.location.href = '/'; // Go back to home
    }
  };

  const handleTitleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setTitle(target.value);
  };

  const handleDescriptionChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setDescription(target.value);
  };

  if (!todo) {
    return <div>Todo not found</div>;
  }

  return (
    <div className="todo-detail">
      <button onClick={() => window.history.back()} className="back-button">← Back</button>

      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={title}
            onInput={handleTitleChange}
            placeholder="Todo title"
            className="title-input"
          />
          <textarea
            value={description}
            onInput={handleDescriptionChange}
            placeholder="Todo description"
            className="description-input"
          />
          <div className="button-group">
            <button onClick={handleSave} className="save-button">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="todo-content">
          <h2 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
            {todo.title}
            <button onClick={handleToggleCompletion} className="toggle-completion">
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
          </h2>
          <p className="todo-description">{todo.description || 'No description'}</p>
          <div className="todo-meta">
            <p>Created: {todo.createdAt.toLocaleString()}</p>
            <p>Updated: {todo.updatedAt.toLocaleString()}</p>
            <p>Status: {todo.completed ? 'Completed' : 'Pending'}</p>
          </div>
          <div className="button-group">
            <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
            <button onClick={handleDelete} className="delete-button">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}