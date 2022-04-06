import React, { useState } from "react";
import styles from "./taskinput.module.css";
import useTaskStore from "../../store/task.store";

const TaskInput = () => {
  const [task, setTask] = useState<string>("");
  const addTask = useTaskStore((state) => state.addTask);
  const createTask = () => {
    if (task && addTask) {
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
