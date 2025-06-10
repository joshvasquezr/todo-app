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
    addBtn.addEventListener('click', () => {
        const text = inputEl.value.trim();
        if (!text) {
            console.warn("Cannot add empty todo.");
            return;
        }
        addTodo(text);
        inputEl.value = '';
        renderTodos();
    });
}
const listContainer = document.querySelector('.list-container');
function renderTodos() {
    listContainer.innerHTML = '';
    const todos = listTodos();
    for (const todo of todos) {
        // Create the outer wrapper
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            toggleTodo(todo.id);
            renderTodos();
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
        // Add to container
        listContainer.appendChild(todoItem);
    }
}
initUI();
