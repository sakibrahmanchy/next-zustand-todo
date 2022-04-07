# Zustand: Another React State Management Library

```
npx create-next-app@latest --ts
```

What is your project named? `zustand-next-ts`

```
cd zustand-next-ts
```

```
code .
```

`create-next-app` by default installs latest (react v18), which is not stable yet. We want to use React a more stable version React v17.0.2. To change this go to `package.json` and change `react` and `react-dom` versions to 17.0.2 like following:

```
"react": "17.0.2",
"react-dom": "17.0.2"
```

```
npm i zustand uuid
```

```
npm i @types/uuid --save-dev
```

We are done with our installation. Now lets configure our app theme. First of all go to `styles/globals.css` file and add the following lines in the bottom of the file:

```
:root {
  --color-primary: #0078d7;
  --color-accent: #edebe9;
}
```

We will be using this two css variables allover our application. Lets start designing our app. We want our app structure like the following:

<img src="https://raw.githubusercontent.com/sakibrahmanchy/next-zustand-todo/main/screenshots/app-look.png">

As we can, see, there are four main components:

1. Top Bar
2. Menu (Side Bar)
3. Task Input
4. Task List

So start configuring our app by going to `pages/index.js` and replacing the existing content with the follwoing:

`pages/index.js`

```
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      {/* <TopBar /> */}
      <main className={styles.main}>
        <div className={styles.sidebar}>{/* <Menu /> */}</div>
        <div className={styles.todo}>
          <h2>All Tasks</h2>
          {/* <TaskInput /> */}
          {/* <TaskList /> */}
        </div>
      </main>
    </div>
  );
};

export default Home;

```

As we can see from the code, we are starting to design our app structure, we need to build the individual components that will shape our app structure.

Before building the component, lets change our app title and some meta tags by going into `_app.js` and replace the content with the following:

`pages/_app.js`

```
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>My Todo App</title>
        <meta
          name="description"
          content="Managing your todos has never been easier!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

```

Here, we just modified the code to include the title and a descripiton meta tag and a favicon with the Next JS build in `head` library, which helps us to append elements in the document head (More details: https://nextjs.org/docs/api-reference/next/head).

Okay now lets start building our components one by one. Lets start with the `TopBar` component. Lets create the following directories under the root directory:
`components/topbar`.

Create a file name `topbar.tsx` in the `components/topbar` folder and put the following content there:

`components/topbar/topbar.tsx`

```
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

```

Also create the relevant css file and put following styles in there:

`components/topbar/topbar.module.css`

```
.topbar {
  width: 100%;
  background-color: var(--color-primary);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  height: 60px;
  justify-items: center;
  align-items: center;
}

.logo {
  color: white;
  text-decoration: wavy;
}

.search {
  padding: 8px;
  width: 300px;
  border-radius: 2px;
  border: none;
  cursor: pointer;
}
```

Now we want to import this topbar in our main page (`index.tsx`).

```
import TopBar from "../components/topbar/topbar";
```

Okay, now we want to uncomment the TopBar in `line 8` of `index.tsx` as the component is imported and ready to test.

Lets run our app with `npm run dev` and we can see that the app looks kinda broken, but the topbar is there.

<img src="https://raw.githubusercontent.com/sakibrahmanchy/next-zustand-todo/main/screenshots/broken-design-topbar.png">

To fix this design go to `styles/Home.module.css` and replace the content with the following:

`styles/Home.module.css`

```
.main {
  display: flex;
  height: 100vh;
}

.sidebar {
  flex-grow: 0.5;
  padding-top: 20px;
  background-color: var(--color-accent);
}

.todo {
  padding: 20px;
  flex-grow: 4;
}

```

As we have added the designs for our main, sidebar and the todo list and input section, if we check our browser, its an acceptable design at last:

<img src="https://raw.githubusercontent.com/sakibrahmanchy/next-zustand-todo/main/screenshots/basic-design.png">

Okay. Now lets go ahead and add designs for our `menu` component.
At first, we will define couple of types for our menu and menu-items:

```
type MenuItemKey = "all" | "completed" | "important";

export type MenuItem = {
  name: string; // Name of Menu Item
  icon?: string; // Icon for the Menu Item
  url?: string; // Url of the menu item
  key: MenuItemKey; // Unique Key For the menu item, three types - all, completed, important
};

export type MenuProps = {
  items?: MenuItem[];
};
```

Now we want to iterate through our menu items and render the menu. We also want to make sure when we click a menu link it takes us to the relevant url for which we will use `Next Link`. Lets add the following contents in the `components/menu/menu.tsx` file:

`components/menu/menu.tsx`

```
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
```

Also relevant css for the menu:

`components/menu/menu.module.css`

```
.menu {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.listItem {
  padding: 10px;
  cursor: pointer;
}

.listItem:hover {
  background: white;
}

.icon {
  padding: 10px;
}

.listItem__selected {
  background-color: var(--color-primary);
  color: white;
}

.listItem__selected:hover {
  background-color: var(--color-primary);
  color: white;
}

```

Now we want to import the Menu component in `pages/index.tsx` and use it:

`pages/index.tsx`

```
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import TopBar from "../components/topbar/topbar";
import Menu from "../components/menu/menu";

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
          {/* <TaskInput /> */}
          {/* <TaskList /> */}
        </div>
      </main>
    </div>
  );
};

export default Home;

```

Hmm, a lot of code. Here basically we rendered the menu items and added urls to work as their link. Those link wont work yet though. Lets see how does it look in the browser:
