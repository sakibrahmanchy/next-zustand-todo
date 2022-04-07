import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import TopBar from "../components/topbar/topbar";
import Menu from "../components/menu/menu";
import TaskInput from "../components/taskinput/taskinput";

const Home: NextPage = () => {
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
          {/* <TaskList
            tasks={[
              {
                id: "1231",
                name: "Task 1",
                important: false,
                completed: false,
                created_at: new Date(),
              },
            ]}
          /> */}
        </div>
      </main>
    </div>
  );
};

export default Home;
