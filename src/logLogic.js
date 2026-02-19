export function createLog(taskId, actionType, taskTitle){
    return {
        logId : crypto.randomUUID(),
        targetTaskId : taskId,
        timeStamp: Date.now(),
        description: `${actionType} on task: ${taskTitle}`,
        action: actionType
    };
}