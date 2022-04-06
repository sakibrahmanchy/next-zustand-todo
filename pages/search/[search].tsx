import type { NextPage } from "next";
import { useRouter } from "next/router";
import Menu from "../../components/menu/menu";
import TaskInput from "../../components/taskinput/taskinput";
import TaskList from "../../components/tasklist/tasklist";
import TopBar from "../../components/topbar/topbar";
import useTaskStore from "../../store/task.store";
import styles from "../../styles/Home.module.css";

const Search: NextPage = () => {
  const router = useRouter();
  const { search = "" } = router.query;
  const searchKey = (search as string).replace("q=", "");
  const relatedTasks = useTaskStore((state) =>
    state.tasks.filter(({ name = "" }) =>
      name.toLowerCase().includes(searchKey)
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
