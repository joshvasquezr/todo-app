import { TodoManager } from './manager/TodoManager.js';
import { initUI } from './ui/events.js';
import { renderTodos } from './ui/render.js';
window.addEventListener('DOMContentLoaded', () => {
    const todoManager = new TodoManager();
    initUI(todoManager);
    renderTodos(todoManager);
});
