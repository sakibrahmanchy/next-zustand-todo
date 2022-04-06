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
      <input className={styles.search} type="text" />
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
