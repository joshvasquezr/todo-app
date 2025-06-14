import { generateRandomId } from '../utils/random.js';
export class TodoManager {
    constructor() {
        this.todoMap = new Map();
        this.ids = new Set();
        this.undoStack = [];
        this.redoStack = [];
        this.loadFromStorage();
    }
    saveToStorage() {
        const todos = this.getTodos();
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    loadFromStorage() {
        const saved = localStorage.getItem('todos');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.todoMap.clear();
            this.ids.clear();
            for (const todo of parsed) {
                this.todoMap.set(todo.id, todo);
                this.ids.add(todo.id);
            }
        }
    }
    addTodo(text) {
        this.saveState();
        if (!text.trim()) {
            console.warn("Cannot add empty todo.");
            return;
        }
        const id = generateRandomId(this.ids);
        this.todoMap.set(id, { id, text, completed: false });
        this.saveToStorage();
    }
    removeTodo(id) {
        this.saveState();
        this.todoMap.delete(id);
        this.ids.delete(id);
        this.saveToStorage();
    }
    toggleTodo(id) {
        this.saveState();
        const todo = this.todoMap.get(id);
        if (todo)
            todo.completed = !todo.completed;
        this.saveToStorage();
    }
    updateTodoText(id, newText) {
        this.saveState();
        const todo = this.todoMap.get(id);
        if (todo)
            todo.text = newText;
        this.saveToStorage();
    }
    undo() {
        if (this.undoStack.length === 0)
            return;
        this.redoStack.push(this.snapshot());
        const prev = this.undoStack.pop();
        if (prev) {
            this.loadSnapshot(prev);
            this.saveToStorage();
        }
    }
    redo() {
        if (this.redoStack.length === 0)
            return;
        this.undoStack.push(this.snapshot());
        const next = this.redoStack.pop();
        if (next) {
            this.loadSnapshot(next);
            this.saveToStorage();
        }
    }
    getTodos() {
        return Array.from(this.todoMap.values());
    }
    getCompleted() {
        return this.getTodos().filter(todo => todo.completed);
    }
    completeAll() {
        for (const todo of this.todoMap.values()) {
            this.toggleTodo(todo.id);
        }
        this.saveToStorage();
    }
    hasTodo(id) {
        return this.todoMap.has(id);
    }
    isCompleted(id) {
        return this.todoMap.get(id)?.completed;
    }
    clearAll() {
        this.todoMap.clear();
        this.ids.clear();
        this.saveToStorage();
    }
    saveState() {
        this.undoStack.push(this.snapshot());
        this.redoStack = [];
    }
    snapshot() {
        return Array.from(this.todoMap.values()).map(todo => ({ ...todo }));
    }
    loadSnapshot(snapshot) {
        this.todoMap.clear();
        for (const todo of snapshot) {
            this.todoMap.set(todo.id, { ...todo });
        }
    }
}
