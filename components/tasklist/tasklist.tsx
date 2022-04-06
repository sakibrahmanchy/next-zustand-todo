import { useEffect, useState } from "react";
import useTaskStore, { Task } from "../../store/task.store";
import styles from "./task.module.css";

type SortType = "date" | "name";

type TaskProps = {
  tasks?: Task[];
};

const sortTasks = (tasks: Task[], sortType: SortType) => {
  return sortType === "date"
    ? tasks.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    : tasks.sort((a, b) => a.name.localeCompare(b.name));
};

const TaskList: React.FC<TaskProps> = ({ tasks = null }) => {
  const stateTasks = useTaskStore((state) => state.tasks);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const toggleImportant = useTaskStore((state) => state.toggleImportant);
  const removeTask = useTaskStore((state) => state.removeTask);
  const [sort, setSort] = useState<SortType>("date");
  const [currentTasks, setTasks] = useState(
    sortTasks(tasks || stateTasks, sort)
  );

  useEffect(() => {
    setTasks(sortTasks(tasks || stateTasks, sort));
  }, [sort, tasks, currentTasks, stateTasks]);

  if (!currentTasks.length) {
    return <div className={styles.taskList}>No tasks available yet!</div>;
  }

  return (
    <ul className={styles.taskList}>
      <li className={`${styles.taskListItem} ${styles.taskCount}`}>
        <span>
          Sort by &nbsp;
          <select
            className={styles.taskListSort}
            onChange={(e) => {
              if (!e.target) {
                return;
              }
              setSort(e.target.value as SortType);
            }}
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
        </span>
      </li>
      {currentTasks.map(
        ({ id, name, completed = false, important, created_at }, index) => (
          <li key={index} className={styles.taskListItem}>
            <input
              type="checkbox"
              className={styles.checkBox}
              checked={completed}
              onChange={(e) => {
                if (toggleComplete && id) {
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
              onClick={(e) => {
                if (toggleImportant && id) {
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
              onClick={(e) => {
                if (removeTask && id) {
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
