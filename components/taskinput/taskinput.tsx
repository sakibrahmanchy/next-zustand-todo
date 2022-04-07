import React, { useState } from "react";
import styles from "./taskinput.module.css";

const TaskInput = () => {
  const [task, setTask] = useState<string>("");
  const createTask = () => {};
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
