// create a type
type Todo  = {
    id: number;
    text: string;
    completed: boolean;
}

const ids: Set<number> = new Set();

// initialize the list array
let todoMap: Map<number, Todo> = new Map();

function addTodo(newText: string): void {
    // check for empty entries
    if (!newText.trim()) {
        console.warn("Cannot add empty todo.");
        return;
    }

    let num = randomNum();
    // this creates a new type for to-do
    const newTodo: Todo = {
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
function removeTodo(id: number) {
    // access the id number in the map and remove
    todoMap.delete(id);
    ids.delete(id);
}

function randomNum(): number {
    let newNum = Math.floor(Math.random() * 1000);
    while (ids.has(newNum)) {
        newNum = Math.floor(Math.random() * 1000);
    }
    ids.add(newNum);
    return newNum;
}

function toggleTodo(id: number): void {
    const todo = todoMap.get(id);
    if (todo) {
        todo.completed = !todo.completed;
    } else {
        console.warn(`ToDo with ID ${id} not found.`);
    }
}

function clearTodo() {
    todoMap.clear();
    ids.clear();
}

function listTodos(): Todo[] {
    return Array.from(todoMap.values());
}

function updateTodoText(id: number, newText: string): void {
    const todo = todoMap.get(id);
    if (todo) {
        todo.text = newText;
    } else {
        console.warn(`ToDo with ID ${id} not found.`);
    }
}

function getTodo(id: number): Todo | undefined {
    return todoMap.get(id);
}

function getCompletedTodos(): Todo[] {
    let completedTodos: Todo[] = [];
    for (const todo of todoMap.values()) {
        if (todo.completed) {
            completedTodos.push(todo);
        }
    }
    return completedTodos;
}

function getActiveTodos(): Todo[] {
    let activeTodos: Todo[] = [];

    for (const todo of todoMap.values()) {
        if (!todo.completed) {
            activeTodos.push(todo);
        }
    }
    return activeTodos;
}

function completeAll(): void {
    for (const todo of todoMap.values()) {
        todo.completed = true;
    }
}

function hasTodo(id: number): boolean {
    return todoMap.has(id);
}

function isCompleted(id: number): boolean | undefined{
    const todo = todoMap.get(id);

    if (todo) {
        return todo.completed;
    } else {
        console.warn(`ToDo with ID ${id} not found.`)
    }
}

function initUI() {
    const inputEl = document.getElementById('todo-item') as HTMLInputElement;
    const addBtn = document.getElementById('add-item') as HTMLButtonElement;

    addBtn.addEventListener('click', () => {
        const text = inputEl.value.trim();

        if (!text) {
            console.warn("Cannot add empty todo.")
            return;
        }

        addTodo(text);
        inputEl.value = '';
        renderTodos();
    })
}

const listContainer = document.querySelector('.list-container') as HTMLDivElement;

function renderTodos(): void {
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