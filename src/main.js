import { TodoManager } from './manager/TodoManager';
import { initUI } from './ui/events';
import { renderTodos } from './ui/render';
const todoManager = new TodoManager();
initUI(todoManager);
renderTodos(todoManager);
