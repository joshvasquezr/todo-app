import { TodoManager } from '../manager/TodoManager.js';
import { renderTodos } from './render.js';

export function initUI(todoManager: TodoManager): void {
    const inputEl = document.getElementById('todo-item') as HTMLInputElement;
    const addBtn = document.getElementById('add-item') as HTMLButtonElement;
    const undoBtn = document.getElementById('undo-btn') as HTMLButtonElement;
    const redoBtn = document.getElementById('redo-btn') as HTMLButtonElement;
    const listContainer = document.querySelector('.list-container') as HTMLDivElement;

    addBtn.addEventListener('click', () => {
        const text = inputEl.value.trim();
        if (!text) return;
        todoManager.addTodo(text);
        inputEl.value = '';
        renderTodos(todoManager);
        inputEl.focus();
    });

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const text = inputEl.value.trim();
            if (!text) return;
            todoManager.addTodo(text);
            inputEl.value = '';
            renderTodos(todoManager);
            if (!e.shiftKey) inputEl.focus();
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const firstItem = document.querySelector('.todo-item') as HTMLElement;
            if (firstItem) firstItem.focus();
        }
    });

    undoBtn.addEventListener('click', () => {
        todoManager.undo();
        renderTodos(todoManager);
    });

    document.addEventListener('keydown', (e) => {
        if ((e.key === 'y' && e.ctrlKey)) {
            e.preventDefault();
            todoManager.redo();
            renderTodos(todoManager);
        } else if ((e.key === 'u' && e.ctrlKey) || (e.key === 'z' && e.ctrlKey)) {
            e.preventDefault();
            todoManager.undo();
            renderTodos(todoManager);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const activeTag = document.activeElement?.tagName.toLowerCase();
            const activeClass = document.activeElement?.classList.contains('todo-item');

            // If no input is focused and we're not already in a todo item
            if (
                activeTag !== 'input' &&
                activeTag !== 'textarea' &&
                !activeClass
            ) {
                const todoElements = Array.from(document.querySelectorAll('.todo-item')) as HTMLElement[];
                if (todoElements.length > 0) {
                    e.preventDefault();
                    todoElements[0].focus();
                }
            }
        } else if (e.ctrlKey && e.shiftKey && e.key === 'Backspace') {
            e.preventDefault();
            todoManager.clearAll();
            renderTodos(todoManager);
        }
    })

    redoBtn.addEventListener('click', () => {
        todoManager.redo();
        renderTodos(todoManager);
    });

    listContainer.addEventListener('keydown', (e) => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('todo-item')) return;

        const todoElements = Array.from(document.querySelectorAll('.todo-item')) as HTMLElement[];
        const index = todoElements.indexOf(target);

        if (e.key === 'Enter') {
            const checkbox = target.querySelector('input[type="checkbox"]') as HTMLInputElement;
            checkbox?.click();
        }

        if (e.key === 'Backspace' || e.key === 'Delete') {
            const idAttr = target.getAttribute('data-id');
            let nextId: number | undefined;

            if (todoElements.length > 1) {
                const fallbackTarget = index === 0 ? todoElements[1] : todoElements[index - 1];
                nextId = Number(fallbackTarget.getAttribute('data-id'));
            }

            if (idAttr) {
                todoManager.removeTodo(Number(idAttr));
                renderTodos(todoManager, nextId);
            }
        }

        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            const span = target.querySelector('span');
            const newText = prompt("Edit todo:", span?.textContent || '');
            if (newText && newText.trim() !== '') {
                const idAttr = todoElements[index].getAttribute('data-id');
                if (idAttr) {
                    todoManager.updateTodoText(Number(idAttr), newText.trim());
                    renderTodos(todoManager, Number(idAttr));
                }
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (index < todoElements.length - 1) {
                todoElements[index + 1].focus();
            }
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
                todoElements[index - 1].focus();
            } else {
                inputEl.focus();
            }
        }
    });
}
