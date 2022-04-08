import { useRouter } from "next/router";
import React from "react";
import styles from "./topbar.module.css";

const TopBar = () => {
  const router = useRouter();
  const { search } = router.query;
  const searchInputHandle = (e: any) => {
    if (!e) {
      return;
    }

    e.preventDefault();
    router.push(`/search?q=${e?.target?.value || ""}`);
  };
  return (
    <div className={styles.topbar}>
      <h4 className={styles.logo}>My Todo App</h4>
      <input
        className={styles.search}
        type="text"
        autoFocus={!!search}
        placeholder="Search"
        onFocus={searchInputHandle}
        onInput={searchInputHandle}
        onKeyDown={(e) =>
          searchInputHandle(e.key === "Enter" ? "enter" : false)
        }
      />
    </div>
  );
};

export default TopBar;
