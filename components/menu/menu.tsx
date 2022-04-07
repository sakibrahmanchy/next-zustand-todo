import Link from "next/link";
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
  return (
    <ul className={styles.menu}>
      {items.map(({ name, icon = "", url = null, key = "" }, index) =>
        url ? (
          <Link key={key} href={url} passHref>
            <li key={key} className={`${styles.listItem}`}>
              <span
                className={styles.icon}
                dangerouslySetInnerHTML={{ __html: icon }}
              />
              {name}
            </li>
          </Link>
        ) : (
          <li key={key} className={styles.listItem}>
            <span className={styles.icon}>
              <i dangerouslySetInnerHTML={{ __html: icon }}></i>
            </span>
            {name}
          </li>
        )
      )}
    </ul>
  );
};

export default Menu;
