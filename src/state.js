import { createLog } from './logLogic';
import { createTask } from './taskLogic';


const state = {
    tasks : [],
    logs : [],
    filter: 'all'
    
    // deleteTask : (taskId) => {},
    // editTask : (taskId) => {},
    // saveState : (taskId) => {},
    // loadState : (taskId) => {},
    // generateLog : (taskId) => {},
}


export const addTaskToState = (title) => {
        const newTask = createTask(title);
        const newLog = createLog(newTask.id, 'CREATE', newTask.title);
        state.tasks.push(newTask);
        state.logs.push(newLog);
        console.log("✅ Task & Log added to state");
        return newTask;
    };
