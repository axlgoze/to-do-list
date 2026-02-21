/** @jest-environment jsdom */
import { addTaskToState, removeTaskOfState, getTasks, resetState, STORAGE_KEY} from '../state.js';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

describe('Suite: State Management with JSDOM', () => {

    beforeAll(() => {
        // Aseguramos que structuredClone esté disponible globalmente para todos los tests
        if (!global.structuredClone) {
            global.structuredClone = (val) => JSON.parse(JSON.stringify(val));
        }
    });
    
    beforeEach(() => {
        // JSDOM persiste los datos entre tests si no los limpias
        localStorage.clear(); 
        resetState();
        jest.restoreAllMocks();
    });

    test('should persist task in localStorage', () => {
        // 1. Espiamos el prototipo real de Storage
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        // 2. Ejecutamos la acción
        addTaskToState('Aprender JSDOM');

        // 3. Verificamos la llamada
        expect(setItemSpy).toHaveBeenCalled();
        
        // 4. Verificación de "Caja Negra" (la más confiable)
        const rawData = localStorage.getItem(STORAGE_KEY); // Asumiendo que usas esta key
        expect(rawData).toContain('Aprender JSDOM');
    });

    test('Should add a new task to the task array.', () => {
        addTaskToState('Test Task')
        const tasks = getTasks();
        expect(tasks.length).toBe(1);
    });

    test('The added task should have the correct title', () => {
        // Escribe aquí cómo verificarías que el .title de la primera tarea es correcto
        const title = 'same title';
        addTaskToState(title);
        const tasks = getTasks();
        expect(tasks[0].title).toBe(title)
    });

    test('should remove a task from the task array', () => {
        const title = 'Task to ve removed';
        addTaskToState(title);

        const currentTasks = getTasks();
        const taskId = currentTasks[0].id;
        const taskTitle = currentTasks[0].title;
        removeTaskOfState(taskId, taskTitle);

        const tasksAfter = getTasks();



        expect(tasksAfter.length).toBe(0)
    });

});