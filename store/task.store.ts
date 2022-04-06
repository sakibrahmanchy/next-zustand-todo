import create from 'zustand';
import { persist } from 'zustand/middleware'
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
        tasks: state.tasks.map((task) => {
            if (id === task.id) {
                return {
                    ...task,
                    completed: !task.completed,
                }
            }
            return task;
        })
    })),
    toggleImportant: (id) => set((state: TaskState) => ({
        tasks: state.tasks.map((task) => {
            if (id === task.id) {
                return {
                    ...task,
                    important: !task.important,
                }
            }
            return task;
        })
    })),
    removeTask: (id: string) => set((state: TaskState) => ({
        tasks: state.tasks.filter(({ id: taskId }) => id !== taskId)
    }))
});


const useTaskStore = create<TaskState>(persist(
    store,
    {
        name: 'task-storage', // unique name
        getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
    }
))

export default useTaskStore;