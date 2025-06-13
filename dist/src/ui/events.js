import { renderTodos } from './render.js';
export function initUI(todoManager) {
    const inputEl = document.getElementById('todo-item');
    const addBtn = document.getElementById('add-item');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const clearBtn = document.getElementById('clear-btn');
    const completeBtn = document.getElementById('complete-btn');
    const listContainer = document.querySelector('.list-container');
    addBtn.addEventListener('click', () => {
        const text = inputEl.value.trim();
        if (!text)
            return;
        todoManager.addTodo(text);
        inputEl.value = '';
        renderTodos(todoManager);
        inputEl.focus();
    });
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const text = inputEl.value.trim();
            if (!text)
                return;
            todoManager.addTodo(text);
            inputEl.value = '';
            renderTodos(todoManager);
            if (!e.shiftKey)
                inputEl.focus();
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const firstItem = document.querySelector('.todo-item');
            if (firstItem)
                firstItem.focus();
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
        }
        else if ((e.key === 'u' && e.ctrlKey) || (e.key === 'z' && e.ctrlKey)) {
            e.preventDefault();
            todoManager.undo();
            renderTodos(todoManager);
        }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const activeTag = document.activeElement?.tagName.toLowerCase();
            const activeClass = document.activeElement?.classList.contains('todo-item');
            // If no input is focused and we're not already in a todo item
            if (activeTag !== 'input' &&
                activeTag !== 'textarea' &&
                !activeClass) {
                const todoElements = Array.from(document.querySelectorAll('.todo-item'));
                if (todoElements.length > 0) {
                    e.preventDefault();
                    todoElements[0].focus();
                }
            }
        }
        else if (e.ctrlKey && e.shiftKey && e.key === 'Backspace') {
            e.preventDefault();
            todoManager.clearAll();
            renderTodos(todoManager);
        }
        else if (e.key === 'Escape') {
            const active = document.activeElement;
            if (active && active !== document.body) {
                active.blur(); // removes focus from input/button/etc.
            }
        }
        else if (e.key.length === 1 &&
            (() => {
                const tag = document.activeElement?.tagName?.toLowerCase();
                return tag && !['input', 'textarea'].includes(tag);
            })()) {
            e.preventDefault(); // 👈 prevent browser's default input behavior
            inputEl.focus();
            inputEl.value += e.key;
            const len = inputEl.value.length;
            inputEl.setSelectionRange(len, len);
        }
        else if (e.key === 'Enter') {
            const text = inputEl.value.trim();
            if (!text)
                return;
            todoManager.addTodo(text);
            inputEl.value = '';
            renderTodos(todoManager);
            if (!e.shiftKey)
                inputEl.focus();
        }
    });
    redoBtn.addEventListener('click', () => {
        todoManager.redo();
        renderTodos(todoManager);
    });
    clearBtn.addEventListener('click', () => {
        todoManager.clearAll();
        renderTodos(todoManager);
    });
    completeBtn.addEventListener('click', () => {
        todoManager.completeAll();
        renderTodos(todoManager);
    });
    listContainer.addEventListener('keydown', (e) => {
        const target = e.target;
        if (!target.classList.contains('todo-item'))
            return;
        const todoElements = Array.from(document.querySelectorAll('.todo-item'));
        const index = todoElements.indexOf(target);
        if (e.key === 'Enter') {
            const checkbox = target.querySelector('input[type="checkbox"]');
            checkbox?.click();
        }
        if (e.key === 'Backspace' || e.key === 'Delete') {
            const idAttr = target.getAttribute('data-id');
            let nextId;
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
            }
            else {
                inputEl.focus();
            }
        }
    });
}
