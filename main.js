"use strict";
const ids = new Set();
// initialize the list array
let todoMap = new Map();
function addTodo(newText) {
    // check for empty entries
    if (!newText.trim()) {
        console.warn("Cannot add empty todo.");
        return;
    }
    let num = randomNum();
    // this creates a new type for to-do
    const newTodo = {
        id: num,
        text: newText,
        completed: false
    };
    todoMap.set(num, newTodo);
}
/**
 *
 * @param id
 */
function removeTodo(id) {
    // access the id number in the map and remove
    todoMap.delete(id);
    ids.delete(id);
}
function randomNum() {
    let newNum = Math.floor(Math.random() * 1000);
    while (ids.has(newNum)) {
        newNum = Math.floor(Math.random() * 1000);
    }
    ids.add(newNum);
    return newNum;
}
function toggleTodo(id) {
    const todo = todoMap.get(id);
    if (todo) {
        todo.completed = !todo.completed;
    }
    else {
        console.warn(`ToDo with ID ${id} not found.`);
    }
}
function clearTodo() {
    todoMap.clear();
    ids.clear();
}
function listTodos() {
    return Array.from(todoMap.values());
}
function updateTodoText(id, newText) {
    const todo = todoMap.get(id);
    if (todo) {
        todo.text = newText;
    }
    else {
        console.warn(`ToDo with ID ${id} not found.`);
    }
}
function getTodo(id) {
    return todoMap.get(id);
}
function getCompletedTodos() {
    let completedTodos = [];
    for (const todo of todoMap.values()) {
        if (todo.completed) {
            completedTodos.push(todo);
        }
    }
    return completedTodos;
}
function getActiveTodos() {
    let activeTodos = [];
    for (const todo of todoMap.values()) {
        if (!todo.completed) {
            activeTodos.push(todo);
        }
    }
    return activeTodos;
}
function completeAll() {
    for (const todo of todoMap.values()) {
        todo.completed = true;
    }
}
function hasTodo(id) {
    return todoMap.has(id);
}
function isCompleted(id) {
    const todo = todoMap.get(id);
    if (todo) {
        return todo.completed;
    }
    else {
        console.warn(`ToDo with ID ${id} not found.`);
    }
}
function initUI() {
    const inputEl = document.getElementById('todo-item');
    const addBtn = document.getElementById('add-item');
    const listContainer = document.querySelector('.list-container');
    const listEl = document.querySelectorAll('.todo-item');
    addBtn.addEventListener('click', () => {
        const text = inputEl.value.trim();
        if (!text) {
            console.warn("Cannot add empty todo.");
            return;
        }
        addTodo(text);
        inputEl.value = '';
        renderTodos();
        inputEl.focus();
    });
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const text = inputEl.value.trim();
            if (!text) {
                console.warn("Cannot add empty todo.");
                return;
            }
            addTodo(text);
            inputEl.value = '';
            renderTodos();
            if (!e.shiftKey) {
                inputEl.focus();
            }
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const firstItem = document.querySelector('.todo-item');
            if (firstItem) {
                firstItem.focus();
            }
        }
    });
    listContainer.addEventListener('keydown', (e) => {
        var _a;
        const target = e.target;
        if (!target.classList.contains('todo-item'))
            return;
        const todoElements = Array.from(document.querySelectorAll('.todo-item'));
        const index = todoElements.indexOf(target);
        if (e.key === 'Enter') {
            const idAttr = (_a = todoElements[index]) === null || _a === void 0 ? void 0 : _a.getAttribute('data-id');
            // toggle completion
            const checkbox = target.querySelector('input[type="checkbox"]');
            checkbox.click();
        }
        if (e.key === 'Backspace' || e.key == 'Delete') {
            // delete todo
            const deleteBtn = target.querySelector('button');
            const idAttr = target.getAttribute('data-id');
            let nextId;
            if (todoElements.length > 1) {
                const fallbackTarget = index === 0
                    ? todoElements[1] // focus the next item that moves into index 0
                    : todoElements[index - 1]; // focus previous item
                nextId = Number(fallbackTarget.getAttribute('data-id'));
            }
            if (idAttr) {
                removeTodo(Number(idAttr));
                renderTodos(nextId); // focus previous or fallback to undefined
            }
        }
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            const span = target.querySelector('span');
            if (!span)
                return;
            const newText = prompt("Edit todo:", span.textContent || '');
            if (newText !== null && newText.trim() != '') {
                span.textContent = newText.trim();
                const idAttr = todoElements[index].getAttribute('data-id');
                if (idAttr)
                    updateTodoText(Number(idAttr), newText.trim());
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
const listContainer = document.querySelector('.list-container');
function renderTodos(focusedId) {
    listContainer.innerHTML = '';
    const todos = listTodos();
    for (const todo of todos) {
        // Create the outer wrapper
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.setAttribute('data-id', String(todo.id));
        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            toggleTodo(todo.id);
            renderTodos(todo.id);
        });
        // Create the text span
        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        if (todo.completed) {
            textSpan.style.textDecoration = 'line-through';
        }
        // create the remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '❌';
        removeBtn.addEventListener('click', () => {
            removeTodo(todo.id);
            renderTodos();
        });
        // Assemble the item
        todoItem.appendChild(checkbox);
        todoItem.appendChild(textSpan);
        todoItem.appendChild(removeBtn);
        todoItem.tabIndex = 0; // makes div focusable
        // Add to container
        listContainer.appendChild(todoItem);
    }
    if (focusedId) {
        const toFocus = document.querySelector(`.todo-item[data-id="${focusedId}"]`);
        if (toFocus)
            toFocus.focus();
    }
    const inputEl = document.getElementById('todo-item');
    if (todos.length === 0) {
        inputEl.focus();
    }
}
initUI();
