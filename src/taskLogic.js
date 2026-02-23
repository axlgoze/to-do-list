// import { getTasks } from "./state,js";

export function createTask(text){
    return {
        id : crypto.randomUUID(),
        title: text,
        createdAt: Date.now(),
        iscompleted: false
    };
}
