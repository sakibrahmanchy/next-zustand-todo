import type { NextPage } from "next";
import Menu from "../components/menu/menu";
import TaskInput from "../components/taskinput/taskinput";
import TaskList from "../components/tasklist/tasklist";
import TopBar from "../components/topbar/topbar";
import useTaskStore from "../store/task.store";
import styles from "../styles/Home.module.css";

const Completed: NextPage = () => {
  const completedTasks = useTaskStore((state) =>
    state.tasks.filter(({ completed }) => completed)
  );
  return (
    <div className={styles.container}>
      <TopBar />
      <main className={styles.main}>
        <div className={styles.sidebar}>
          <Menu />
        </div>
        <div className={styles.todo}>
          <h2>Completed Tasks</h2>
          <TaskInput />
          <TaskList tasks={completedTasks} />
        </div>
      </main>
    </div>
  );
};

export default Completed;
