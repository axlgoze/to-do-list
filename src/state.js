import { createLog } from './logLogic';
import { createTask } from './taskLogic';


const VALID_FILTERS = ['all', 'pending', 'completed'];

export const _state = {
    tasks : [],
    logs : [],
    filter: VALID_FILTERS[0],
    
    // deleteTask : (taskId) => {},
    // editTask : (taskId) => {},
    // saveState : (taskId) => {},
    // loadState : (taskId) => {},
    // generateLog : (taskId) => {},
}

export function getSate(){
    const currentState = structuredClone(_state);
    return currentState;
}

export function getTasks(){
    const currentTasks = structuredClone(_state.tasks);
    return currentTasks
}

function getLogs(){
    const currentLogs = structuredClone(_state.logs);
    return currentLogs;
}

export function setFilter(newFilter){
    if (VALID_FILTERS.includes(newFilter)) {
        _state.filter = filter;
    }
}


export const addTaskToState = (title) => {
        const newTask = createTask(title);
        const newLog = createLog(newTask.id, 'CREATE', newTask.title);
        _state.tasks.push(newTask);
        _state.logs.push(newLog);
        console.log("✅ Task & Log added to state");
        return newTask;
    };
