import { renderTodos } from './render';
export function initUI(todoManager) {
    const inputEl = document.getElementById('todo-item');
    const addBtn = document.getElementById('add-item');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
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
    redoBtn.addEventListener('click', () => {
        todoManager.redo();
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
            checkbox === null || checkbox === void 0 ? void 0 : checkbox.click();
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
            const newText = prompt("Edit todo:", (span === null || span === void 0 ? void 0 : span.textContent) || '');
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
