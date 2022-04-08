# Zustand: Yet Another React State Management Library

It's no surprise that state management has become such a contentious topic in the React community, given how quickly the technology has progressed. With solutions like component state, `Context API`, `Redux` and Facebook's experimental `Recoil`, the world of state management is becoming more and more diverse. Learn how to use `Zustand`, a state management framework for React that is quick, lightweight, and scalable.

## Why Zustand?

From the docs of zustand itself:

> Don't disregard it because it's cute. It has quite the claws, lots of time was spent to deal with common pitfalls.

So zustand tries to solve the following problems:

**1. Zombie Child**

This is a situation where incorrect data may be returned from your stores. This happens when a child component subscribes to the store and its subscription runs before the parent stops rendering it. When it reads a value from the store based on props, that data no longer exists, and if the extraction logic is not careful, this may result in an error being thrown.

More on this here: https://react-redux.js.org/api/hooks#stale-props-and-zombie-children

**2. React Concurrency**

Typically how React or other UI libraries work, once they start rendering an update, including creating new DOM nodes and running the code inside components, they can’t interrupt this work. This is called `blocking rendering`. In concurrent mode rendering is not blocking, its interruptipble. Such an example where zustand can be used to update component without rendering: https://github.com/pmndrs/zustand#transient-updates-for-often-occuring-state-changes.

More on this here: https://17.reactjs.org/docs/concurrent-mode-intro.html#blocking-vs-interruptible-rendering

**3.Context Loss**

This is a complex situation where some react features does not work across multiple/mixed renderers. For example a specific context/provider could not be accessed from inside or outside from a portal or a canvas.

More on this here: https://github.com/facebook/react/issues/13332#issuecomment-513088081

As `zustand` is a hook based state management system (`Your store is a hook, put anything inside it`) and also it does not wrap your app in context providers, its a very simple yet effective implementation of a state management system.

## Comparison between Zustand, Redux And Context Api

| Zustand                                         | Redux                                           | Context Api                                                                         |
| ----------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| Simple and un-opinionated                       | Can get very complex, boilerplatey, opinionated | Opinionated about for large implementations                                         |
| Scalable                                        | Scalable                                        | Not scalable for large projects                                                     |
| Make hooks the primary means of consuming state | Stores, Reducers and actions                    | Global state, shared between components                                             |
| Handles both static and dynamic data            | Handles both static and dynamic data            | Specifically designed for static data, that is not often refreshed or updated       |
| Easy debugging with dev tool                    | Easy debugging with dev tool                    | Debugging can be hard in highly nested React Component Structure even with Dev Tool |
|                                                 |                                                 |                                                                                     |

## Enough talk, lets code!

We will be building a small todo-app with `React`, `NextJS` and `Zustand` to get comfortable with `zustand`. To save from the design hassles, we've already prepared a boilerplate to get started.

Lets start by cloning the boiler plate:

```
git clone --branch boilerplate git@github.com:sakibrahmanchy/next-zustand-todo.git
```

```
cd next-zustand-todo
```

And installing the dependencies:

```
npm i
```

Awesome! Lets explore the app a bit. First run the app by running:

```
npm run dev
```

and visiting `localhost:3000`

<img src="https://raw.githubusercontent.com/sakibrahmanchy/next-zustand-todo/main/screenshots/basic-app-look.png">

If we look at the structure of our app:

<img src="https://raw.githubusercontent.com/sakibrahmanchy/next-zustand-todo/main/screenshots/file-structure.png">

We have three components and the design is looking good. Lets try to add a bit of functionalities:

1. Define Task types
2. Add create task functionality
3. Add list task functionality
4. Toggle task mark important functionality
5. Toogle task status functionality (pending/completed)
6. Add task delete functionality
7. Categorize tasks based on importance and completion
8. Storing tasks in localstorage
9. Add task search functionality

We will use zustand to carry out this functionalities over the app.

Lets create a new folder named `stores` in the root directory and create a file name `task.store.ts` inside that folder.

First, lets define the task types with typescript for better inference:

`stores/task.store.ts`

```jsx
export type Task = {
  id: string,
  name: string,
  important?: boolean,
  completed?: boolean,
  created_at: Date,
};
```

Now we want to define the functionalities. To store the tasks and to trigger the functionalities globally we need a store. And, as we know, in `zustand` store is only a hook. Lets import this hook and name it as `create`. This will be used to create our store which will consist our state.

```jsx
import create from "zustand";

export type Task = {
  id: string,
  name: string,
  important?: boolean,
  completed?: boolean,
  created_at: Date,
};

// const useTaskStore = create(set => state);
```

Lets conceptualize our state with types:

```jsx
interface TaskState {
  tasks: Task[];
  addTask?: (name: string, created_at?: Date) => void;
  toggleComplete?: (id: string) => void;
  toggleImportant?: (id: string) => void;
  removeTask?: (id: string) => void;
}
```

Great, so our `create` function will be responsible to return some hook that will help us to connect us to the store. We will also describe the store with the functionalities:

```jsx
import create from "zustand";
import { v4 as uuid } from "uuid";

export type Task = {
  id: string,
  name: string,
  important?: boolean,
  subtasks?: Task[],
  completed?: boolean,
  created_at: Date,
};

interface TaskState {
  tasks: Task[];
  addTask?: (name: string, created_at?: Date) => void;
  toggleComplete?: (id: string) => void;
  toggleImportant?: (id: string) => void;
  removeTask?: (id: string) => void;
}

const store: (set: any) => TaskState = (set) => ({
  tasks: [],
  addTask: (name, created_at) => {
    set((state: TaskState) => ({
      tasks: [
        ...state.tasks,
        {
          id: uuid(),
          name,
          created_at: created_at || new Date(),
          completed: false,
          important: false,
          subtasks: [],
        },
      ],
    }));
  },
  toggleComplete: (id) =>
    set((state: TaskState) => ({
      tasks: state.tasks.map(({ completed, ...others }) => ({
        ...others,
        completed: others.id === id ? !completed : completed,
      })),
    })),
  toggleImportant: (id) =>
    set((state: TaskState) => ({
      tasks: state.tasks.map(({ important, ...others }) => ({
        ...others,
        important: others.id === id ? !important : important,
      })),
    })),
  removeTask: (id: string) =>
    set((state: TaskState) => ({
      tasks: state.tasks.filter(({ id: taskId }) => id !== taskId),
    })),
});

export default create < TaskState > store;
```

Alright, our state is all ready, we can now use this store in our app, where ever we want. No providers to wrap, no boilerplates, nothing!

Lets test this by importing it in our input component and using it with the task input:

`taskinput.tsx`

```jsx
import React, { useState } from "react";
import styles from "./taskinput.module.css";
import useTaskStore from "../../store/task.store";

const TaskInput = () => {
  const [task, setTask] = useState<string>("");
  const addTask = useTaskStore((state) => state.addTask;
  const createTask = () => {
    if (addTask && task) {
      addTask(task);
      setTask("");
    }
  };
  return (
    <div className={styles.taskInputContainer}>
      <input
        className={styles.taskInput}
        onChange={(e) => setTask(e.target.value)}
        value={task}
        placeholder="Add a task"
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            createTask();
          }
        }}
      />
      <button className={styles.taskInputButton} onClick={() => createTask()}>
        Add
      </button>
    </div>
  );
};

export default TaskInput;
```

To test this we will use zustand dev tools. Go to `task.store.ts` and import and use dev tools from zustand:

```jsx
import { devtools } from 'zustand/middleware'

....

...

....

export default create<TaskState>(devtools(store));

```

If you already have redux devtools in your browser, then you can test it there, otherwise install it from [here](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en).

Great, now if we open the dev tools on the side and add some task, we can see in the dev tools that the tasks are being added in the store!

Now we will use this store to list our tasks.

Lets create a new component named `tasklist.tsx` in `components/tasklist` directory and put the contents inside it:

```jsx
import useTaskStore from "../../store/task.store";
import styles from "./task.module.css";

const TaskList: React.FC<TaskProps> = () => {
  const tasks = [];
  if (!tasks.length) {
    return <div className={styles.taskList}>No tasks available yet!</div>;
  }

  return (
    <ul className={styles.taskList}>
      <li className={`${styles.taskListItem} ${styles.taskCount}`}>
        <span>
          Sort by &nbsp;
          <select className={styles.taskListSort}>
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
        </span>
      </li>
      {tasks.map(
        ({ id, name, completed = false, important, created_at }, index) => (
          <li key={index} className={styles.taskListItem}>
            <input
              type="checkbox"
              className={styles.checkBox}
              checked={completed}
              onChange={(e) => {}}
            />
            <span className={completed ? styles["taskListItem__complete"] : ""}>
              {name}
            </span>
            <span className={styles.filler} />
            <span
              className={styles["taskListItem__favorite"]}
              onClick={(e) => {}}
            >
              {important ? (
                <span className={styles["taskListItem__important"]}>
                  &#x2605;
                </span>
              ) : (
                <span>&#9734;</span>
              )}
            </span>
            <span
              className={styles["taskListItem__remove"]}
              onClick={(e) => {}}
            >
              &#x292C;
            </span>
          </li>
        )
      )}
    </ul>
  );
};

export default TaskList;
```

Also we will put the following css to design the list in
`taskinput.module.css` in the same directory:

```css
.taskInputContainer {
  background-color: var(--color-accent);
  width: 100%;
  height: 180px;
  padding: 20px;
}

.taskInput {
  border: none;
  border-radius: 4px;
  width: 100%;
  height: 100px;
  font-size: 20px;
  padding: 10px;
}

.taskInputButton {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  float: right;
  height: 40px;
  width: 100px;
  margin-top: 10px;
  cursor: pointer;
}

.taskInputButton:hover {
  background-color: #84aedd;
}
```

Great now lets use our store to fetch the task list:

```
  const tasks = useTaskStore((state) => state.tasks);
```

And dont forget to import the tasklist component and use in `pages/index.tsx` file

```jsx
.....
import TaskInput from "../components/taskinput/taskinput";
import TaskList from "../components/tasklist/tasklist";

......
......
......

<h2>All Tasks</h2>
<TaskInput />
<TaskList />


....
....
```

Awesome. We have got an working task list if we check the browser. It updates if we add new tasks:

<img src="https://raw.githubusercontent.com/sakibrahmanchy/next-zustand-todo/main/screenshots/tasklist.png">

Great. Now lets quickly add other functionalities like mark complete, mark important and delete task by importing them from store and using it on events:

```jsx
...
const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const toggleImportant = useTaskStore((state) => state.toggleImportant);
  const removeTask = useTaskStore((state) => state.removeTask);

...

// Complete Checkbox

<input
    type="checkbox"
    className={styles.checkBox}
    checked={completed}
    onChange={() => {
    if (toggleComplete) {
        toggleComplete(id);
    }
    }}
/>

// Mark as important

<span
    className={styles["taskListItem__favorite"]}
    onClick={() => {
    if (toggleImportant) {
        toggleImportant(id);
    }
    }}
>

// Remove task

 <span
    className={styles["taskListItem__remove"]}
    onClick={() => {
    if (removeTask) {
        removeTask(id);
    }
    }}
>

```

Awesome. Now lets visit our browser and verify that the functionalites properly!

Okay, now we want to categorize the tasks by importance and completion status. We want to show them in separate lists. So we can refactor our task list to be a reusable component to be used on multiple places:

`components/tasklist/tasklist.tsx`

```jsx
import { useEffect, useState } from "react";
import useTaskStore, { Task } from "../../store/task.store";
import styles from "./task.module.css";

type TaskProps = {
  tasks?: Task[];
};

const TaskList: React.FC<TaskProps> = ({ tasks = null }) => {
  const stateTasks = useTaskStore((state) => state.tasks);

  const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks || stateTasks);

  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const toggleImportant = useTaskStore((state) => state.toggleImportant);
  const removeTask = useTaskStore((state) => state.removeTask);

  useEffect(() => {
    setCurrentTasks(tasks || stateTasks);
  }, [tasks, stateTasks, currentTasks]);

  if (!currentTasks.length) {
    return <div className={styles.taskList}>No tasks available yet!</div>;
  }

  return (
    <ul className={styles.taskList}>
      <li className={`${styles.taskListItem} ${styles.taskCount}`}>
        <span>
          Sort by &nbsp;
          <select className={styles.taskListSort}>
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
        </span>
      </li>
      {currentTasks.map(
        ({ id, name, completed = false, important = false }, index) => (
          <li key={index} className={styles.taskListItem}>
            <input
              type="checkbox"
              className={styles.checkBox}
              checked={completed}
              onChange={() => {
                if (toggleComplete) {
                  toggleComplete(id);
                }
              }}
            />
            <span className={completed ? styles["taskListItem__complete"] : ""}>
              {name}
            </span>
            <span className={styles.filler} />
            <span
              className={styles["taskListItem__favorite"]}
              onClick={() => {
                if (toggleImportant) {
                  toggleImportant(id);
                }
              }}
            >
              {important ? (
                <span className={styles["taskListItem__important"]}>
                  &#x2605;
                </span>
              ) : (
                <span>&#9734;</span>
              )}
            </span>
            <span
              className={styles["taskListItem__remove"]}
              onClick={() => {
                if (removeTask) {
                  removeTask(id);
                }
              }}
            >
              &#x292C;
            </span>
          </li>
        )
      )}
    </ul>
  );
};

export default TaskList;
```

Now lets create a new page in `pages/important.tsx` file and use the task list component in there like following:

```jsx
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import TopBar from "../components/topbar/topbar";
import Menu from "../components/menu/menu";
import TaskInput from "../components/taskinput/taskinput";
import TaskList from "../components/tasklist/tasklist";
import useTaskStore from "../store/task.store";

const Home: NextPage = () => {
  const importantTasks = useTaskStore((state) =>
    state.tasks.filter(({ important }) => important)
  );
  return (
    <div className={styles.container}>
      <TopBar />
      <main className={styles.main}>
        <div className={styles.sidebar}>
          <Menu />
        </div>
        <div className={styles.todo}>
          <h2>All Tasks</h2>
          <TaskInput />
          <TaskList tasks={importantTasks} />
        </div>
      </main>
    </div>
  );
};

export default Home;
```

Similarly lets create a new page in `pages/completed.tsx` file and use the task list component in there like following:

```jsx
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import TopBar from "../components/topbar/topbar";
import Menu from "../components/menu/menu";
import TaskInput from "../components/taskinput/taskinput";
import TaskList from "../components/tasklist/tasklist";
import useTaskStore from "../store/task.store";

const Home: NextPage = () => {
  const completedTasks = useTaskStore((state) =>
    state.tasks.filter(({ important }) => important)
  );
  return (
    <div className={styles.container}>
      <TopBar />
      <main className={styles.main}>
        <div className={styles.sidebar}>
          <Menu />
        </div>
        <div className={styles.todo}>
          <h2>All Tasks</h2>
          <TaskInput />
          <TaskList tasks={completedTasks} />
        </div>
      </main>
    </div>
  );
};

export default Home;
```

There we go, we have just categorized our tasks with very tiny effort on the state management portion.

As we go through this pages, one thing we might have noticed, the data is not persistant, thats because we are not storing in anywhere. Lets use zustand middlewares to store them in `localstorage`.

Modify the `store/task.store.ts` and import `persist` middleware at the top, then we will use it to persist thet whole store in localstorage:

```js

```

We also want to complete the search functionality. Let create another page called `search.tsx` and put following contents in it:

```jsx
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Menu from "../components/menu/menu";
import TaskList from "../components/tasklist/tasklist";
import TopBar from "../components/topbar/topbar";
import useTaskStore from "../store/task.store";
import styles from "../../styles/Home.module.css";

const Search: NextPage = () => {
  const router = useRouter();
  const { q: searchKey = "" } = router.query;
  const relatedTasks = useTaskStore((state) =>
    state.tasks.filter(({ name = "" }) =>
      name.toLowerCase().includes(searchKey as string)
    )
  );

  return (
    <div className={styles.container}>
      <TopBar />
      <main className={styles.main}>
        <div className={styles.sidebar}>
          <Menu />
        </div>
        <div className={styles.todo}>
          <h2>Search results for: {searchKey}</h2>
          {/* <TaskInput /> */}
          <TaskList tasks={relatedTasks} />
        </div>
      </main>
    </div>
  );
};

export default Search;
```

In this page we want to take a query from the browser url (which will be pushed to router history, when user types it in the search bar) and filter all tasks by that query. We want to also make sure to do this in the search bar itself. Lets go to `components\topbar\topbar.tsx` and add this functionality on input change handler:

```jsx
const TopBar = () => {
  const router = useRouter();
  const { search } = router.query;
  const searchInputHandle = (e: any) => {
    if (!e) {
      return;
    }

    e.preventDefault();
    router.push(`/search/q=${e?.target?.value || ""}`);
  };


  .......
   <input
        className={styles.search}
        type="text"
        autoFocus={!!search}
        placeholder="Search"
        onFocus={searchInputHandle}
        onInput={searchInputHandle}
        onKeyDown={(e) =>
            searchInputHandle(e.key === "Enter" ? "enter" : false)
        }
    />
```

Awesome! Now we have a dynamic search feature, we can test it by moving to browser and trying to filter the tasks by typing in the search bar!

## Conclusion

The Zustand library, in summary, is one of the smallest state management libraries available today. Developers can further enhance their experience by using plug-ins and middleware to increase the platform's capabilities.
Redux DevTools, Persist, etc. are all supported by Zustand, which gives access to the store outside of React.

Accordingly, Zustand appears to be a good choice as a state manager. The library's simplicity makes it an excellent choice for React state management newbies.
