import create from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware'
import { v4 as uuid } from 'uuid';

export type Task = {
    id: string;
    name: string;
    important?: boolean;
    subtasks?: Task[];
    completed?: boolean;
    created_at: Date;
}

interface TaskState {
    tasks: Task[];
    addTask?: (name: string, created_at?: Date) => void,
    toggleComplete?: (id: string) => void;
    toggleImportant?: (id: string) => void;
    removeTask?: (id: string) => void;
}

const store: (set: any) => TaskState = (set) => ({
    tasks: [],
    addTask: (name, created_at) => {
        set((state: TaskState) => ({
            tasks: [...state.tasks, {
                id: uuid(),
                name,
                created_at: created_at || new Date(),
                completed: false,
                important: false,
                subtasks: [],
            }]
        }))
    },
    toggleComplete: (id) => set((state: TaskState) => ({
        tasks: state.tasks.map(({ completed, ...others }) =>
            ({ ...others, completed: others.id === id ? !completed : completed }))
    })),
    toggleImportant: (id) => set((state: TaskState) => ({
        tasks: state.tasks.map(({ important, ...others }) =>
            ({ ...others, important: others.id === id ? !important : important }))
    })),
    removeTask: (id: string) => set((state: TaskState) => ({
        tasks: state.tasks.filter(({ id: taskId }) => id !== taskId)
    }))
});


export default create<TaskState>(devtools(persist(store, {
    name: "task-storage",
    getStorage: () => localStorage
})));