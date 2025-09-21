// Todo List Application JavaScript
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.editingId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.render();
    }
    
    initializeElements() {
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.taskCount = document.getElementById('taskCount');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
    }
    
    bindEvents() {
        // Form submission
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });
        
        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
        
        // Clear completed button
        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });
        
        // Enter key in input
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        const todo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.unshift(todo);
        this.todoInput.value = '';
        this.saveTodos();
        this.render();
        
        // Focus back to input
        this.todoInput.focus();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;
        
        this.editingId = id;
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        const textElement = todoItem.querySelector('.todo-text');
        
        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.className = 'edit-input';
        input.style.cssText = `
            flex: 1;
            padding: 8px 12px;
            border: 2px solid #667eea;
            border-radius: 6px;
            font-size: 1rem;
            font-family: inherit;
            background: #fff;
            margin-right: 15px;
        `;
        
        // Replace text with input
        textElement.style.display = 'none';
        textElement.parentNode.insertBefore(input, textElement);
        input.focus();
        input.select();
        
        // Handle save/cancel
        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== todo.text) {
                todo.text = newText;
                this.saveTodos();
            }
            this.cancelEdit(id);
        };
        
        const cancelEdit = () => {
            this.cancelEdit(id);
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                cancelEdit();
            }
        });
    }
    
    cancelEdit(id) {
        this.editingId = null;
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        const input = todoItem.querySelector('.edit-input');
        const textElement = todoItem.querySelector('.todo-text');
        
        if (input) {
            input.remove();
            textElement.style.display = 'block';
        }
    }
    
    deleteTodo(id) {
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            todoItem.classList.add('removing');
            setTimeout(() => {
                this.todos = this.todos.filter(t => t.id !== id);
                this.saveTodos();
                this.render();
            }, 300);
        }
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        this.render();
    }
    
    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
    }
    
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }
    
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;
        
        let countText = '';
        if (total === 0) {
            countText = 'No tasks';
        } else if (this.currentFilter === 'all') {
            countText = `${total} task${total !== 1 ? 's' : ''}`;
        } else if (this.currentFilter === 'active') {
            countText = `${active} active task${active !== 1 ? 's' : ''}`;
        } else if (this.currentFilter === 'completed') {
            countText = `${completed} completed task${completed !== 1 ? 's' : ''}`;
        }
        
        this.taskCount.textContent = countText;
        
        // Show/hide clear completed button
        if (completed > 0) {
            this.clearCompletedBtn.style.display = 'flex';
        } else {
            this.clearCompletedBtn.style.display = 'none';
        }
    }
    
    render() {
        const filteredTodos = this.getFilteredTodos();
        
        // Update stats
        this.updateStats();
        
        // Clear current todos
        this.todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            this.todoList.appendChild(this.emptyState.cloneNode(true));
            return;
        }
        
        // Render todos
        filteredTodos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.todoList.appendChild(todoElement);
        });
    }
    
    createTodoElement(todo) {
        const todoDiv = document.createElement('div');
        todoDiv.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoDiv.dataset.id = todo.id;
        
        todoDiv.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="todoApp.toggleTodo('${todo.id}')"></div>
            <div class="todo-text">${this.escapeHtml(todo.text)}</div>
            <div class="todo-actions">
                <button class="todo-btn edit-btn" onclick="todoApp.editTodo('${todo.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="todo-btn delete-btn" onclick="todoApp.deleteTodo('${todo.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        return todoDiv;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    
    // Public methods for external access
    getTodos() {
        return this.todos;
    }
    
    addTodoFromAPI(todo) {
        this.todos.unshift(todo);
        this.saveTodos();
        this.render();
    }
    
    updateTodoFromAPI(id, updates) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            Object.assign(todo, updates);
            this.saveTodos();
            this.render();
        }
    }
    
    deleteTodoFromAPI(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add todo
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        todoApp.addTodo();
    }
    
    // Escape to cancel editing
    if (e.key === 'Escape' && todoApp.editingId) {
        todoApp.cancelEdit(todoApp.editingId);
    }
});

// Add drag and drop functionality (optional enhancement)
let draggedElement = null;

document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('todo-item')) {
        draggedElement = e.target;
        e.target.style.opacity = '0.5';
    }
});

document.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('todo-item')) {
        e.target.style.opacity = '';
        draggedElement = null;
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedElement && e.target.classList.contains('todo-item')) {
        const targetId = e.target.dataset.id;
        const draggedId = draggedElement.dataset.id;
        
        // Reorder todos
        const draggedTodo = todoApp.todos.find(t => t.id === draggedId);
        const targetTodo = todoApp.todos.find(t => t.id === targetId);
        
        if (draggedTodo && targetTodo) {
            const draggedIndex = todoApp.todos.indexOf(draggedTodo);
            const targetIndex = todoApp.todos.indexOf(targetTodo);
            
            todoApp.todos.splice(draggedIndex, 1);
            todoApp.todos.splice(targetIndex, 0, draggedTodo);
            
            todoApp.saveTodos();
            todoApp.render();
        }
    }
});

// Add touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        // Swipe detected - could be used for quick actions
        console.log('Swipe detected:', diff > 0 ? 'up' : 'down');
    }
}
