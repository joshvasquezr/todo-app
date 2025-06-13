export function renderTodos(todoManager, focusedId) {
    const listContainer = document.querySelector('.list-container');
    const inputEl = document.getElementById('todo-item');
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
        });
        todoItem.appendChild(checkbox);
        todoItem.appendChild(textSpan);
        todoItem.appendChild(removeBtn);
        todoItem.tabIndex = 0;
        listContainer.appendChild(todoItem);
    }
    if (focusedId) {
        const toFocus = document.querySelector(`.todo-item[data-id="${focusedId}"]`);
        if (toFocus)
            toFocus.focus();
    }
    if (todos.length === 0) {
        inputEl.focus();
    }
}
