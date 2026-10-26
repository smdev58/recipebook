# RecipeBook

## Project Overview

RecipeBook is my React course project. Users can browse recipes, create an account and share their own recipes.

## Demo Link

The project is not deployed yet.

## Documentation

The project uses React, React Router, Vite and CSS.

The basic layout, Home page, About page and navigation are currently implemented. The recipe and account features described above are the goal of the project.

## Architecture

```text
src/
  components/
    about/
    footer/
    header/
    home/
    not-found/
  App.jsx
  main.jsx
  styles.css
```

Each page has its own component. App.jsx contains the routes and the shared Header and Footer. main.jsx starts the application and sets up BrowserRouter. The styles are in styles.css.

## Installation

You need Node.js 22.12 or newer.

Install the packages:

```sh
npm install
```

Start the project:

```sh
npm run dev
```

Open the address shown in the terminal.

To build the project:

```sh
npm run build
```

To check the code:

```sh
npm run lint
```

## Functional Guide

The current version has these pages:

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About |
| Any other address | Page not found |

The header links open Home and About without reloading the whole page. The footer is shown on every page. The Page not found screen has a link back to Home.

The full Functional Guide will be completed as the recipe and account features are added.
