import { generateRandomId } from '../utils/random.js';
export class TodoManager {
    constructor() {
        this.todoMap = new Map();
        this.ids = new Set();
        this.undoStack = [];
        this.redoStack = [];
    }
    addTodo(text) {
        this.saveState();
        if (!text.trim()) {
            console.warn("Cannot add empty todo.");
            return;
        }
        const id = generateRandomId(this.ids);
        this.todoMap.set(id, { id, text, completed: false });
    }
    removeTodo(id) {
        this.saveState();
        this.todoMap.delete(id);
        this.ids.delete(id);
    }
    toggleTodo(id) {
        this.saveState();
        const todo = this.todoMap.get(id);
        if (todo)
            todo.completed = !todo.completed;
    }
    updateTodoText(id, newText) {
        this.saveState();
        const todo = this.todoMap.get(id);
        if (todo)
            todo.text = newText;
    }
    undo() {
        if (this.undoStack.length === 0)
            return;
        this.redoStack.push(this.snapshot());
        const prev = this.undoStack.pop();
        if (prev)
            this.loadSnapshot(prev);
    }
    redo() {
        if (this.redoStack.length === 0)
            return;
        this.undoStack.push(this.snapshot());
        const next = this.redoStack.pop();
        if (next)
            this.loadSnapshot(next);
    }
    getTodos() {
        return Array.from(this.todoMap.values());
    }
    getCompleted() {
        return this.getTodos().filter(todo => todo.completed);
    }
    completeAll() {
        for (const todo of this.todoMap.values()) {
            todo.completed = true;
        }
    }
    hasTodo(id) {
        return this.todoMap.has(id);
    }
    isCompleted(id) {
        var _a;
        return (_a = this.todoMap.get(id)) === null || _a === void 0 ? void 0 : _a.completed;
    }
    clearAll() {
        this.todoMap.clear();
        this.ids.clear();
    }
    saveState() {
        this.undoStack.push(this.snapshot());
        this.redoStack = [];
    }
    snapshot() {
        return Array.from(this.todoMap.values()).map(todo => (Object.assign({}, todo)));
    }
    loadSnapshot(snapshot) {
        this.todoMap.clear();
        for (const todo of snapshot) {
            this.todoMap.set(todo.id, Object.assign({}, todo));
        }
    }
}
