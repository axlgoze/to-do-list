import { getVisibleTasks, addTaskToState, removeTaskOfState, toggleTaskStatus} from './state.js';

export function render() {
    // Captura de la lista (UL) donde se renderizarán las tareas
    const taskList = document.querySelector('.task-manager__card-list');
    const taks = getVisibleTasks();
    
    // Corregimos el flujo: .join('') va al final del array generado por .map
    taskList.innerHTML = taks.map(task => `
            <li data-id="${task.id}">
                <div>
                    <i class="card-list__check-icon  ${task.isCompleted ? 'is-completed': ''}"></i>
                    <span class="card-list__task-title ${task.isCompleted ? 'completed' : ''}"">${task.title}</span>
                </div>
                <i class="card-list__remove-icon" data-action="delete"></i>
            </li>
        `).join('')
}


export function initEvents() {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.querySelector('[data-list]');

    if (!taskInput || !addBtn || !taskList) return;

    const handleAdd = () => {
        const title = taskInput.value.trim();
        if (title) {
            addTaskToState(title);
            taskInput.value = '';
            render();
        }
    };

    addBtn.addEventListener('click', handleAdd);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAdd();
    });


    taskList.addEventListener('click', (event) => {
        const target = event.target;
        // 1. Verificamos si el clic fue en el botón de borrar
        const deleteBtn = target.closest('[data-action="delete"]');
        
        if (deleteBtn) {
            // 2. Subimos al <li> para obtener la información de la tarea
            const taskRow = target.closest('li');
            
            // 3. Extraemos los datos necesarios
            const id = taskRow.dataset.id;
            const title = taskRow.querySelector('.card-list__task-title').textContent;

            // 4. Llamamos a la lógica del estado
            removeTaskOfState(id, title);
            
            // 5. Volvemos a pintar
            render();
        }

        // Lógica de Check
        const checkIcon = target.closest('.card-list__check-icon');
        if (checkIcon) {
            const id = target.closest('li').dataset.id;
            toggleTaskStatus(id);
            render();
        }
    });

}



