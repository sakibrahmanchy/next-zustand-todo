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
