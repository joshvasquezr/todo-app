import { Todo } from '../models/Todo.js';
import { generateRandomId } from '../utils/random.js';

export class TodoManager {
    private todoMap: Map<number, Todo> = new Map();
    private ids: Set<number> = new Set();
    private undoStack: Todo[][] = [];
    private redoStack: Todo[][] = [];

    addTodo(text: string): void {
        this.saveState();

        if (!text.trim()) {
            console.warn("Cannot add empty todo.");
            return;
        }

        const id = generateRandomId(this.ids);
        this.todoMap.set(id, {id, text, completed: false});
    }

    removeTodo(id: number): void {
        this.saveState();
        this.todoMap.delete(id);
        this.ids.delete(id);
    }

    toggleTodo(id: number): void {
        this.saveState();
        const todo = this.todoMap.get(id);
        if (todo) todo.completed = !todo.completed;
    }

    updateTodoText(id: number, newText: string): void {
        this.saveState();
        const todo = this.todoMap.get(id);
        if (todo) todo.text = newText;
    }

    undo(): void {
        if (this.undoStack.length === 0) return;

        this.redoStack.push(this.snapshot());
        const prev = this.undoStack.pop();
        if (prev) this.loadSnapshot(prev);
    }

    redo(): void {
        if (this.redoStack.length === 0) return ;

        this.undoStack.push(this.snapshot());
        const next = this.redoStack.pop();
        if (next) this.loadSnapshot(next);
    }

    getTodos(): Todo[] {
        return Array.from(this.todoMap.values());
    }

    getCompleted(): Todo[] {
        return this.getTodos().filter(todo => todo.completed);
    }

    completeAll(): void {
        for (const todo of this.todoMap.values()) {
            todo.completed = true;
        }
    }

    hasTodo(id: number): boolean {
        return this.todoMap.has(id);
    }

    isCompleted(id: number): boolean | undefined {
        return this.todoMap.get(id)?.completed;
    }

    clearAll(): void {
        this.todoMap.clear();
        this.ids.clear();
    }

    private saveState(): void {
        this.undoStack.push(this.snapshot());
        this.redoStack = [];
    }

    private snapshot(): Todo[] {
        return Array.from(this.todoMap.values()).map(todo => ({ ...todo }));
    }

    private loadSnapshot(snapshot: Todo[]): void {
        this.todoMap.clear();
        for (const todo of snapshot) {
            this.todoMap.set(todo.id, { ...todo });
        }
    }
}