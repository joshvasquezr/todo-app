import { Todo } from '../models/Todo';
import { TodoManager } from '../manager/TodoManager.js';

export function renderTodos(todoManager: TodoManager, focusedId?: number): void {
    const listContainer = document.querySelector('.list-container') as HTMLDivElement;
    const inputEl = document.getElementById('todo-item') as HTMLInputElement;

    listContainer.innerHTML = '';
    const todos = todoManager.getTodos();

    for (const todo of todos) {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.setAttribute('data-id', String(todo.id));

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            todoManager.toggleTodo(todo.id);
            renderTodos(todoManager, todo.id);  // ✅ force re-render after state change
        });


        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        if (todo.completed) {
            textSpan.style.textDecoration = 'line-through';
        }

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'x';
        removeBtn.addEventListener('click', () => {
            todoManager.removeTodo(todo.id);
            renderTodos(todoManager);
        })

        todoItem.appendChild(checkbox);
        todoItem.appendChild(textSpan);
        todoItem.appendChild(removeBtn);
        todoItem.tabIndex = 0;

        listContainer.appendChild(todoItem);
    }

    if (focusedId) {
        const toFocus = document.querySelector(`.todo-item[data-id="${focusedId}"]`) as HTMLElement;
        if (toFocus) toFocus.focus();
    }

    if (todos.length === 0) {
        inputEl.focus();
    }
}