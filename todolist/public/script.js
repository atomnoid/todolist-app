// Enhanced Todo List Application with Backend Integration
class TodoApp {
    constructor() {
        this.currentUser = null;
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        this.isAuthenticated = false;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeTheme();
        this.checkAuthStatus();
    }
    
    initializeElements() {
        // Auth elements
        this.authSection = document.getElementById('authSection');
        this.userSection = document.getElementById('userSection');
        this.mainContent = document.getElementById('mainContent');
        this.authTabs = document.querySelectorAll('.auth-tab');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');
        this.registerName = document.getElementById('registerName');
        this.registerEmail = document.getElementById('registerEmail');
        this.registerPassword = document.getElementById('registerPassword');
        this.userName = document.getElementById('userName');
        this.userEmail = document.getElementById('userEmail');
        this.profileBtn = document.getElementById('profileBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Theme elements
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        
        // Todo elements
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.taskCount = document.getElementById('taskCount');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
    }
    
    bindEvents() {
        // Auth tab switching
        this.authTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAuthTab(e.target.dataset.tab);
            });
        });
        
        // Auth forms
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        this.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        // User actions
        this.logoutBtn.addEventListener('click', () => {
            this.handleLogout();
        });
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Todo form
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
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme icon
        if (this.themeIcon) {
            this.themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        // Add transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    async checkAuthStatus() {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const response = await apiService.getProfile();
                if (response.success) {
                    this.currentUser = response.data.user;
                    this.isAuthenticated = true;
                    this.showAuthenticatedUI();
                    await this.loadTodos();
                } else {
                    this.showAuthUI();
                }
            } else {
                this.showAuthUI();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            this.showAuthUI();
        }
    }
    
    showAuthUI() {
        this.authSection.style.display = 'flex';
        this.userSection.style.display = 'none';
        this.mainContent.style.display = 'none';
        this.isAuthenticated = false;
        this.currentUser = null;
    }
    
    showAuthenticatedUI() {
        this.authSection.style.display = 'none';
        this.userSection.style.display = 'block';
        this.mainContent.style.display = 'block';
        this.isAuthenticated = true;
        
        // Update user info
        this.userName.textContent = this.currentUser.name;
        this.userEmail.textContent = this.currentUser.email;
    }
    
    switchAuthTab(tab) {
        this.authTabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        if (tab === 'login') {
            this.loginForm.classList.add('active');
        } else {
            this.registerForm.classList.add('active');
        }
    }
    
    async handleLogin() {
        const email = this.loginEmail.value.trim();
        const password = this.loginPassword.value;
        
        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }
        
        try {
            this.setLoading(this.loginForm, true);
            const response = await apiService.login({ email, password });
            
            if (response.success) {
                this.currentUser = response.data.user;
                this.isAuthenticated = true;
                this.showAuthenticatedUI();
                await this.loadTodos();
                this.showMessage('Login successful!', 'success');
            }
        } catch (error) {
            this.showMessage(error.message || 'Login failed', 'error');
        } finally {
            this.setLoading(this.loginForm, false);
        }
    }
    
    async handleRegister() {
        const name = this.registerName.value.trim();
        const email = this.registerEmail.value.trim();
        const password = this.registerPassword.value;
        
        console.log('Register attempt:', { name, email, password: password ? '***' : 'empty' });
        
        if (!name || !email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }
        
        try {
            this.setLoading(this.registerForm, true);
            console.log('Calling API service register...');
            const response = await apiService.register({ name, email, password });
            console.log('Register response:', response);
            
            if (response.success) {
                this.currentUser = response.data.user;
                this.isAuthenticated = true;
                this.showAuthenticatedUI();
                await this.loadTodos();
                this.showMessage('Registration successful!', 'success');
                
                // Clear form
                this.registerName.value = '';
                this.registerEmail.value = '';
                this.registerPassword.value = '';
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showMessage(error.message || 'Registration failed', 'error');
        } finally {
            this.setLoading(this.registerForm, false);
        }
    }
    
    async handleLogout() {
        try {
            await apiService.logout();
            this.showAuthUI();
            this.todos = [];
            this.render();
            this.showMessage('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    async loadTodos() {
        try {
            const response = await apiService.getTasks({
                status: this.currentFilter,
                limit: 100
            });
            
            if (response.success) {
                this.todos = response.data.tasks;
                this.render();
            }
        } catch (error) {
            console.error('Load todos error:', error);
            this.showMessage('Failed to load tasks', 'error');
        }
    }
    
    async addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        try {
            const response = await apiService.createTask({
                title: text,
                description: '',
                priority: 'medium'
            });
            
            if (response.success) {
                this.todoInput.value = '';
                await this.loadTodos();
                this.todoInput.focus();
            }
        } catch (error) {
            this.showMessage(error.message || 'Failed to create task', 'error');
        }
    }
    
    async toggleTodo(id) {
        try {
            const response = await apiService.toggleTask(id);
            if (response.success) {
                await this.loadTodos();
            }
        } catch (error) {
            this.showMessage(error.message || 'Failed to update task', 'error');
        }
    }
    
    async editTodo(id) {
        const todo = this.todos.find(t => t._id === id);
        if (!todo) return;
        
        this.editingId = id;
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        const textElement = todoItem.querySelector('.todo-text');
        
        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.title;
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
        const saveEdit = async () => {
            const newText = input.value.trim();
            if (newText && newText !== todo.title) {
                try {
                    await apiService.updateTask(id, { title: newText });
                    await this.loadTodos();
                } catch (error) {
                    this.showMessage(error.message || 'Failed to update task', 'error');
                }
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
    
    async deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }
        
        try {
            const response = await apiService.deleteTask(id);
            if (response.success) {
                await this.loadTodos();
            }
        } catch (error) {
            this.showMessage(error.message || 'Failed to delete task', 'error');
        }
    }
    
    async setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        await this.loadTodos();
    }
    
    async clearCompleted() {
        if (!confirm('Are you sure you want to clear all completed tasks?')) {
            return;
        }
        
        try {
            const completedTasks = this.todos.filter(todo => todo.completed);
            const taskIds = completedTasks.map(todo => todo._id);
            
            if (taskIds.length > 0) {
                await apiService.bulkDeleteTasks(taskIds);
                await this.loadTodos();
            }
        } catch (error) {
            this.showMessage(error.message || 'Failed to clear completed tasks', 'error');
        }
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
        todoDiv.dataset.id = todo._id;
        
        todoDiv.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="todoApp.toggleTodo('${todo._id}')"></div>
            <div class="todo-text">${this.escapeHtml(todo.title)}</div>
            <div class="todo-actions">
                <button class="todo-btn edit-btn" onclick="todoApp.editTodo('${todo._id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="todo-btn delete-btn" onclick="todoApp.deleteTodo('${todo._id}')" title="Delete">
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
    
    setLoading(element, loading) {
        if (loading) {
            element.classList.add('loading');
            const button = element.querySelector('button[type="submit"]');
            if (button) {
                button.disabled = true;
            }
        } else {
            element.classList.remove('loading');
            const button = element.querySelector('button[type="submit"]');
            if (button) {
                button.disabled = false;
            }
        }
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        // Insert message at the top of the container
        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add todo
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (todoApp.isAuthenticated) {
            todoApp.addTodo();
        }
    }
    
    // Escape to cancel editing
    if (e.key === 'Escape' && todoApp.editingId) {
        todoApp.cancelEdit(todoApp.editingId);
    }
});
