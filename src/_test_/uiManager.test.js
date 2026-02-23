/** @jest-environment jsdom */
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// 1. Polyfill (Node 20 + JSDOM)
if (typeof global.structuredClone !== 'function') {
    global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// 2. MOCK del estado (Siempre antes de los imports de tu código)
jest.unstable_mockModule('../state.js', () => ({
    getVisibleTasks: jest.fn(),
    addTaskToState: jest.fn(),
    removeTaskOfState: jest.fn(),
    toggleTaskStatus: jest.fn(),
    STORAGE_KEY: 'todo_pro_v1'
}));

// 3. IMPORTS DINÁMICOS (Una sola vez para todo el archivo)
// Importamos todo lo necesario del uiManager y el state mockeado
const { render, initEvents } = await import('../uiManager.js');
const state = await import('../state.js');

describe('uiManager Render Tests suite', () => {
    
    beforeEach(() => {
        // Preparamos el DOM base antes de cada test que el render() espera encontrar
        document.body.innerHTML = `
            <input id="task-input">
            <button id="add-btn">Add</button>
            <ul class="task-manager__card-list" data-list></ul>
        `;
        
        // Limpiamos los mocks para que no se acumulen llamadas de tests anteriores
        jest.clearAllMocks();
    });

    test('Debe pintar una tarea en el DOM cuando el estado tiene datos', () => {
        state.getVisibleTasks.mockReturnValue([
            { id: '123', title: 'Aprender Testing', isCompleted: false }
        ]);

        render();

        const taskTitle = document.querySelector('.card-list__task-title');
        expect(taskTitle).not.toBeNull();
        expect(taskTitle.textContent).toBe('Aprender Testing');
    });

    test('Debe llamar a addTaskToState y limpiar el input al hacer clic en añadir', () => {
        state.addTaskToState.mockImplementation(() => {});
        
        // Aquí NO importamos, solo usamos la función que ya tenemos arriba
        initEvents();

        const input = document.getElementById('task-input');
        const btn = document.getElementById('add-btn');

        input.value = 'Nueva tarea test';
        btn.click();

        expect(state.addTaskToState).toHaveBeenCalledWith('Nueva tarea test');
        expect(input.value).toBe('');
    });

    test('should call removeTaskOfState when delete icon is clicked', () => {
        state.getVisibleTasks.mockReturnValue([
            { id: 'task-123', title: 'Task to Delete', isCompleted: false }
        ]);

        render(); 
        initEvents();

        const deleteBtn = document.querySelector('[data-action="delete"]');
        deleteBtn.click();

        expect(state.removeTaskOfState).toHaveBeenCalledWith('task-123', 'Task to Delete');
    });

    test('should mark/unmark a task when click on check icon', () => {
        state.getVisibleTasks.mockReturnValue([
            { id: '123', title: 'Test Task', isCompleted: false }
        ]);

        render();
        initEvents();

        const checkIcon = document.querySelector('.card-list__check-icon');
        checkIcon.click();

        expect(state.toggleTaskStatus).toHaveBeenCalledWith('123');
    });
    
    test('Marked task should contain completed class', () => {
        // 1. Arrange: Tarea pendiente
        state.getVisibleTasks.mockReturnValue([
            { id: '321', title: 'Test Task', isCompleted: false }
        ]);
        
        render();
        initEvents();

        // 2. Act: Simulamos que el estado cambia y clickeamos
        state.getVisibleTasks.mockReturnValue([
            { id: '321', title: 'Test Task', isCompleted: true }
        ]);
        
        const checkIcon = document.querySelector('.card-list__check-icon');
        checkIcon.click(); // Esto dispara toggle y el render() interno de initEvents

        // 3. Assert
        const updatedIcon = document.querySelector('.card-list__check-icon');
        expect(updatedIcon.classList.contains('is-completed')).toBe(true);
    });
});