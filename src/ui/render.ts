import { Todo } from '../models/Todo';
import { TodoManager } from '../manager/TodoManager.js';

export function renderTodos(todoManager: TodoManager, focusedId?: number): void {
    const listContainer = document.querySelector('.list-container') as HTMLDivElement;
    const inputEl = document.getElementById('todo-item') as HTMLInputElement;

    listContainer.innerHTML = '';
    const todos = todoManager.getTodos();

    for (const todo of todos) {
        const todoItem = document.createElement('div');
        todoItem.className =
            'todo-item flex justify-between items-center px-4 py-2 bg-gray-50 border rounded hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none';
        todoItem.setAttribute('data-id', String(todo.id));
        todoItem.tabIndex = 0;

        // Left side: checkbox + text
        const leftSide = document.createElement('div');
        leftSide.className = 'flex items-center gap-2';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.className = 'cursor-pointer';
        checkbox.addEventListener('change', () => {
            todoManager.toggleTodo(todo.id);
            renderTodos(todoManager, todo.id);
        });

        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        textSpan.className = todo.completed
            ? 'line-through text-gray-400'
            : 'text-gray-800';

        leftSide.appendChild(checkbox);
        leftSide.appendChild(textSpan);

        // Right side: remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.className = 'text-red-400 hover:text-red-600 text-lg font-bold px-2';
        removeBtn.addEventListener('click', () => {
            todoManager.removeTodo(todo.id);
            renderTodos(todoManager);
        });

        todoItem.appendChild(leftSide);
        todoItem.appendChild(removeBtn);
        listContainer.appendChild(todoItem);

        todoItem.animate(
            [
                { transform: 'scale(0.95)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 }
            ],
            {
                duration: 200,
                easing: 'ease-out'
            }
        )
    }

    if (focusedId) {
        const toFocus = document.querySelector(`.todo-item[data-id="${focusedId}"]`) as HTMLElement;
        if (toFocus) toFocus.focus();
    }

    if (todos.length === 0) {
        inputEl.focus();
    }
}
