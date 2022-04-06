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
