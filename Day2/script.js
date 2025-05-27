document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const allTaskList = document.getElementById('allTaskList');
    const activeTaskList = document.getElementById('activeTaskList');
    const completedTaskList = document.getElementById('completedTaskList');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const taskSections = document.querySelectorAll('.tasks-section');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    let tasks = [];
    
    const scrollPositions = {
        'all': 0,
        'active': 0,
        'completed': 0
    };

    const loadTasks = () => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const switchTab = (tabName) => {
        const currentTab = document.querySelector('.tasks-section.active');
        if (currentTab) {
            const currentTabName = currentTab.id.split('-')[0];
            scrollPositions[currentTabName] = currentTab.scrollTop;
        }

        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        taskSections.forEach(section => {
            section.classList.toggle('active', section.id === `${tabName}-tasks`);
        });

        const newSection = document.getElementById(`${tabName}-tasks`);
        if (newSection) {
            setTimeout(() => {
                newSection.scrollTop = scrollPositions[tabName];
            }, 100);
        }
    };

    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';
        
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.innerHTML = task.completed ? '✓' : '○';
        completeBtn.onclick = () => {
            toggleTask(task.id);
        };
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '✎';
        editBtn.onclick = () => {
            const currentText = task.text;
            const newText = prompt('Edit task:', currentText);
            if (newText && newText.trim() && newText !== currentText) {
                editTask(task.id, newText.trim());
            }
        };
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = () => {
            deleteTask(task.id);
            li.remove();
        };
        
        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(taskText);
        li.appendChild(actionsDiv);
        
        return li;
    };

    const renderTasks = (startIndex = 0, limit = 10) => {
        const endIndex = Math.min(startIndex + limit, tasks.length);
        const tasksToRender = tasks.slice(startIndex, endIndex);
        
        tasksToRender.forEach(task => {
            const allTaskElement = createTaskElement(task);
            const specificTaskElement = createTaskElement(task);
            
            allTaskList.appendChild(allTaskElement);
            
            if (task.completed) {
                completedTaskList.appendChild(specificTaskElement);
            } else {
                activeTaskList.appendChild(specificTaskElement);
            }
        });

        return endIndex < tasks.length;
    };

    const addTask = () => {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            
            allTaskList.innerHTML = '';
            activeTaskList.innerHTML = '';
            completedTaskList.innerHTML = '';
            renderTasks();
            
            const newTaskElement = document.querySelector(`[data-task-id="${newTask.id}"]`);
            if (newTaskElement) {
                newTaskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            taskInput.value = '';
            switchTab('all');
        }
    };

    const toggleTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        saveTasks();
        
        const taskElements = document.querySelectorAll(`[data-task-id="${id}"]`);
        taskElements.forEach(element => {
            element.classList.toggle('completed', task.completed);
            
            const completeBtn = element.querySelector('.complete-btn');
            if (completeBtn) {
                completeBtn.innerHTML = task.completed ? '✓' : '○';
            }
            
            if (task.completed) {
                if (activeTaskList.contains(element)) {
                    activeTaskList.removeChild(element);
                    completedTaskList.appendChild(element);
                }
            } else {
                if (completedTaskList.contains(element)) {
                    completedTaskList.removeChild(element);
                    activeTaskList.appendChild(element);
                }
            }
        });
    };

    const editTask = (id, newText) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText };
            }
            return task;
        });
        saveTasks();
        
        const taskElements = document.querySelectorAll(`[data-task-id="${id}"]`);
        taskElements.forEach(element => {
            const taskText = element.querySelector('.task-text');
            if (taskText) {
                taskText.textContent = newText;
            }
        });
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        
        const taskElements = document.querySelectorAll(`[data-task-id="${id}"]`);
        taskElements.forEach(element => {
            element.remove();
        });
    };

    const handleInfiniteScroll = (e) => {
        const section = e.target;
        const { scrollTop, scrollHeight, clientHeight } = section;
        
        if (scrollTop > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
        
        if (scrollHeight - scrollTop - clientHeight < 50) {
            const currentTab = section.id.split('-')[0];
            const currentTasks = currentTab === 'all' ? tasks :
                               currentTab === 'active' ? tasks.filter(t => !t.completed) :
                               tasks.filter(t => t.completed);
            
            const currentCount = section.querySelectorAll('.task-item').length;
            if (currentCount < currentTasks.length) {
                renderTasks(currentCount);
            }
        }
    };

    addBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    taskSections.forEach(section => {
        section.addEventListener('scroll', handleInfiniteScroll);
    });

    scrollToTopBtn.addEventListener('click', () => {
        const activeSection = document.querySelector('.tasks-section.active');
        if (activeSection) {
            activeSection.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    loadTasks();
    renderTasks();
}); 