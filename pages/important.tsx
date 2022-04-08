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
