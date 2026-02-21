import { createLog } from './logLogic';
import { createTask } from './taskLogic';

const VALID_FILTERS = ['all', 'pending', 'completed'];
export const STORAGE_KEY = 'todo_pro_v1';

const _state = {
    tasks : [],
    logs : [],
    filter: VALID_FILTERS[0],
    
    // deleteTask : (taskId) => {},
    // editTask : (taskId) => {},
 
    // saveState : (taskId) => {},
    // loadState : (taskId) => {},
}

export function getSate(){
    const currentState = structuredClone(_state);
    return currentState;
}

export function setSate(){
    
}

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
        console.log("✅ Task & Log added to state");
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
        console.log("✅ Task & Log added to state");
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

    _state.tasks = savedData.tasks;
    _state.logs = savedData.logs;
    _state.filter = savedData.filter;
}


loadState();

// testing
export function resetState() {
    _state.tasks = [];
    _state.logs = [];
    _state.filter = VALID_FILTERS[0];
}