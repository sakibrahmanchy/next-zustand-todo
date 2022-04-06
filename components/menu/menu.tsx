import Link from "next/link";
import { useRouter } from "next/router";
import useTaskStore from "../../store/task.store";
import styles from "./menu.module.css";

type MenuItemKey = "all" | "completed" | "important";

export type MenuItem = {
  name: string;
  icon?: string;
  url?: string;
  key: MenuItemKey;
};

export type MenuProps = {
  items?: MenuItem[];
};

const DEFAULT_MENU = [
  {
    name: "All",
    key: "all",
    icon: "&#x2638;",
    url: "/",
  },
  {
    name: "Important",
    icon: "&#x2605;",
    key: "important",
    url: "/important",
  },
  {
    name: "Completed",
    key: "completed",
    icon: "&#x2713;",
    url: "/completed",
  },
] as MenuItem[];

const Menu: React.FC<MenuProps> = ({ items = DEFAULT_MENU }) => {
  const {
    all = 0,
    important = 0,
    completed = 0,
  } = useTaskStore((state) => ({
    all: state.tasks.length,
    important: state.tasks.filter(({ important }) => important).length,
    completed: state.tasks.filter(({ completed }) => completed).length,
  }));

  const getValue = (key: MenuItemKey) => {
    switch (key) {
      case "completed":
        return completed;
      case "important":
        return important;
      case "all":
        return all;
      default:
        return 0;
    }
  };

  const router = useRouter();
  const currentRoute = router.asPath;

  return (
    <ul className={styles.menu}>
      {items.map(({ name, icon = "", url = null, key = "" }, index) =>
        url ? (
          <Link key={key} href={url} passHref>
            <li
              key={key}
              className={`${styles.listItem} ${
                currentRoute === url ? styles.listItem__selected : ""
              }`}
            >
              <span
                className={styles.icon}
                dangerouslySetInnerHTML={{ __html: icon }}
              />
              {name}({getValue(key as MenuItemKey)})
            </li>
          </Link>
        ) : (
          <li key={key} className={styles.listItem}>
            <span className={styles.icon}>
              <i dangerouslySetInnerHTML={{ __html: icon }}></i>
            </span>
            {name}({getValue(key as MenuItemKey)})
          </li>
        )
      )}
    </ul>
  );
};

export default Menu;
