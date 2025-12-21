import { PrefetchLink, RouteNames } from "@/shared/navigation";
import type { Todo } from "../store";

export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
        <PrefetchLink
            href={RouteNames.TODO_DETAIL.replace(':id', todo.id)}
            className="todo-link"
        >
            <>
                <h3>{todo.title}</h3>
                <p>{todo.description || 'No description'}</p>
                <small>
                Created: {todo.createdAt.toLocaleDateString()}
                {todo.completed ? ' ✓' : ' ○'}
                </small>
            </>
        </PrefetchLink>
    </li>
  );
}