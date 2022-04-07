import React from "react";
import styles from "./topbar.module.css";

const TopBar = () => {
  return (
    <div className={styles.topbar}>
      <h4 className={styles.logo}>My Todo App</h4>
      <input className={styles.search} type="text" placeholder="Search" />
    </div>
  );
};

export default TopBar;
