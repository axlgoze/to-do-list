import { createLog } from './logLogic.js';
import { createTask } from './taskLogic.js';

const VALID_FILTERS = ['all', 'pending', 'completed'];
export const STORAGE_KEY = 'todo_pro_v1';

const _state = {
    tasks : [],
    logs : [],
    filter: VALID_FILTERS[0],
    
    // editTask : (taskId) => {},
 
}

export function getSate(){
    const currentState = structuredClone(_state);
    return currentState;
}

// export function setSate(){
    
// }

export function getTasks(){
    const currentTasks = structuredClone(_state.tasks);
    return currentTasks
}

export function getLogs(){
    const currentLogs = structuredClone(_state.logs);
    return currentLogs;
}

export function setFilter(newFilter){
    if (VALID_FILTERS.includes(newFilter)) {
        _state.filter = newFilter;
    }
}

export const addTaskToState = (title) => {
        const newTask = createTask(title);
        const newLog = createLog(newTask.id, 'CREATE', newTask.title);
        _state.tasks.push(newTask);
        _state.logs.push(newLog);
        saveState();
        console.log(
            `➕ Task Created: %c"${newTask.title}"%c | ID: ${newTask.id.slice(0,8)}`, 
            'color: #3498db; font-weight: bold', 
            'color: inherit'
        );
        return newTask;
};

export const removeTaskOfState = (taskId,title) =>{
    const index = _state.tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
        // _state.tasks.splice(index, 1);
        _state.tasks = _state.tasks.filter(task => task.id !== taskId);
        const newLog = createLog(taskId, 'DELETE', title);
        _state.logs.push(newLog);
        saveState();
        console.log(
            `🗑️ Task Deleted: %c"${title}"%c`, 
            'color: #e74c3c; font-weight: bold', // Rojo para borrado
            'color: inherit'
        );
    }
};

export function getVisibleTasks(){
    const allTasks = getTasks();
    const currentFilter = _state.filter;
    
    return allTasks.filter((task)=>{

        if(currentFilter === 'completed'){
            return task.isCompleted === true;
        }
        
        if(currentFilter === 'pending'){
            return task.isCompleted === false;
        }
        return true;
    });
}

function saveState(){
    const dataString = JSON.stringify(_state);
    localStorage.setItem(STORAGE_KEY, dataString);
}

function loadState(){
    const dataString = localStorage.getItem(STORAGE_KEY)

    if (!dataString) return;
    
    const savedData = JSON.parse(dataString);

    _state.tasks = savedData.tasks || [];
    _state.logs = savedData.logs || [];
    _state.filter = savedData.filter || VALID_FILTERS[0];

    console.log(
        `💾 State loaded: %c${_state.tasks.length} tasks%c found in LocalStorage`, 
        'color: #2ecc71; font-weight: bold',
        'color: inherit'
    );
}

export function toggleTaskStatus(id){
    const tasks = _state.tasks;
    const task = tasks.find( t => t.id === id)
    if(!task) return;
    task.isCompleted = !task.isCompleted;
    

    //log
    const statusText = task.isCompleted ? 'COMPLETED' : 'PENDING'
    const statusColor = task.isCompleted ? '#1abc9c' : '#e67e22';
    // Creates a Logc object
    const newLog = createLog(task.id, 'UPDATE_STATUS', `${task.title} set to ${statusText}`);
    // push the log object created to the log array
    _state.logs.push(newLog);
    saveState();
    console.log(
        `✅ Task: %c"${task.title}"%c | Status: %c${statusText}%c`, 
        'color: #3498db; font-weight: bold', // Azul para el título
        'color: inherit',                    // Reset
        `color: ${statusColor}; font-weight: bold; text-transform: uppercase;`, // Turquesa o Naranja
        'color: inherit'                     // Reset final
    );
}


loadState();

// testing
export function resetState() {
    _state.tasks = [];
    _state.logs = [];
    _state.filter = VALID_FILTERS[0];
}