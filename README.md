# RecipeBook

## Project Overview

RecipeBook is my React course project. Users can browse recipes, create an account and share their own recipes.

## Demo Link

[Open RecipeBook](https://recipebook-umber.vercel.app/)

- Email: `tester@example.com`
- Password: `RecipeTest!74mK9p`

## Documentation

The project uses React, React Router, Vite and CSS.

Visitors can read recipes and comments. Registered users can add recipes, manage their own recipes and leave comments. Supabase stores the data and handles registration and login. Requests use fetch and the Supabase REST API.

## Architecture

```text
src/
  api/
  components/
    about/
    account/
    catalog/
    comments/
    footer/
    guards/
    header/
    home/
    login/
    my-recipes/
    not-found/
    recipe-card/
    recipe-create/
    recipe-details/
    recipe-edit/
    recipe-form/
    register/
  contexts/
  utils/
  App.jsx
  main.jsx
  styles.css
```

Each page has its own component. App.jsx contains the routes and the shared Header and Footer. main.jsx starts the application and sets up BrowserRouter. The styles are in styles.css.

The api folder contains the recipe, comment and authentication requests. The request helper in utils adds the API key and user token. AuthContext shares the current user. RecipeForm is used for both adding and editing recipes.

## Installation

You need Node.js 22.12 or newer.

Install the packages:

```sh
npm install
```

Copy `.env.example` to `.env.local` in the project folder. Add the URL and publishable key from your Supabase project:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Use a publishable key, not the database password or a secret key. The `.env.local` file is ignored by Git. Restart Vite after changing it.

Supabase needs the recipes and comments tables with row-level security enabled. Enable email/password sign-in and set the Auth Site URL to your frontend address.

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

### 1. Project Overview

Application name: RecipeBook.

Topic: Recipe sharing.

The app lets people browse recipes with images, ingredients and cooking instructions. Users can create an account, share recipes and leave comments on recipes.

### 2. User Access and Permissions

Guests can open Home, About, Catalog, recipe Details, Login and Register. They can read recipes and comments, but cannot create or change records.

Logged-in users can open My Account, Add Recipe and My Recipes. They can comment on recipes, including their own. Only the author can edit or delete a recipe. The database also checks these permissions.

### 3. Authentication and Session Handling

When the app starts, AuthProvider reads the session from localStorage. It checks whether the access token needs refreshing before showing protected pages.

Login sends the email and password to Supabase. The returned session is saved and the user goes to Home. Registration sends the email and password, without the repeated password. If Supabase returns a session, the user is logged in. Otherwise the page asks them to confirm their email and then log in. Email confirmation is enabled for this project. The shared test account is already confirmed.

Context shares the current user across the app. localStorage keeps the session after a page refresh. Passwords are not stored in localStorage. Expired access tokens are refreshed using the refresh token. If refreshing fails, the local session is cleared. Logout calls Supabase and clears the session, including when the server logout fails.

### 4. Routing Structure

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/catalog` | All recipes |
| `/recipes/:recipeId` | Recipe details and comments |
| `/login` | Login, guests only |
| `/register` | Register, guests only |
| `/account` | My Account, logged-in users |
| `/create` | Add Recipe, logged-in users |
| `/my-recipes` | My Recipes, logged-in users |
| `/recipes/:recipeId/edit` | Edit Recipe, author only |
| Any other address | Page not found |

PrivateGuard sends guests to Login. GuestGuard sends logged-in users away from Login and Register to Home. These guards use nested routes and Outlet. The Edit page also checks ownership after loading the recipe.

Details and Edit use the recipeId URL parameter. The header and footer are shared across pages. Navigation uses React Router without a full page reload.

### 5. List to Details Flow

Catalog loads all recipes from Supabase, newest first. Each RecipeCard shows the recipe name, image and a Details link. Home shows the latest three recipes. My Recipes loads only the current user's recipes. There is no search or filter form.

The Details link opens `/recipes/:recipeId`. useParams reads the ID, and the app requests that recipe. The page shows ingredients, instructions and comments. useNavigate opens the next page after saving or deleting a recipe.

### 6. Data Source and Backend

The backend is Supabase, with hosted PostgreSQL and real email/password authentication. Data comes from network requests, not hardcoded arrays, and remains in the database between visits.

The recipes table has id, title, image_url, ingredients, instructions, owner_id and created_at. The comments table has id, recipe_id, comment, owner_id and created_at. recipe_id links a comment to its recipe. Deleting a recipe also deletes its comments.

The database fills in the IDs, ownership and creation dates. Grants and row-level security allow public reading and restrict changes to recipe authors. Comment creation requires a logged-in user.

### 7. Data Operations

- Create: Add Recipe sends a POST request to `/rest/v1/recipes`. The new recipe opens in Details.
- Read: Home, Catalog, My Recipes and Details use GET requests. Comments are loaded for the current recipe.
- Update: Edit loads the existing recipe and checks its author. Saving sends a PATCH request filtered by ID, then opens Details with the updated data.
- Delete: The author confirms deletion, then the app sends a DELETE request filtered by ID. Catalog opens and loads the remaining recipes.

Empty results from create, update or delete are treated as failures. The app does not show success when no record changed.

### 8. Forms and Validation

Forms are used for Login, Register, Add Recipe, Edit Recipe and Add Comment. Inputs are controlled with value and onChange. Forms use onSubmit and preventDefault.

- Email is required and must have a valid email format.
- Registration passwords need at least eight characters. The repeated password must match.
- Recipe names need between three and 100 characters after trimming.
- Image URL is required and must be a valid HTTP or HTTPS URL.
- Ingredients and instructions cannot be empty or only spaces.
- Comments need between one and 2000 characters after trimming.

Messages appear next to the forms. Buttons are disabled during saving. Database constraints also reject invalid recipe and comment content.

### 9. React Techniques

useState stores form values, fetched data, loading state and error messages. useEffect loads data and cleans up requests with AbortController.

For example, Catalog fetches recipes when it mounts. Details loads another recipe when recipeId changes. On unmount, the request is aborted. AuthProvider also removes its listeners and interval on unmount.

AuthContext shares the user and authentication functions. Header, guards, My Account, My Recipes, Details, Comments, Login and Register use this Context. useParams reads the recipe ID, Link and NavLink handle navigation, and useNavigate handles redirects after actions.

Styling uses the external styles.css file. Recipe cards wrap onto fewer columns on smaller screens.

### 10. Typical User Flow

1. Open Catalog and choose a recipe.
2. Register, confirm the email if needed, and log in.
3. Open Add Recipe and save a recipe with an image, ingredients and instructions.
4. Open My Recipes and edit the recipe.
5. Leave a comment on a recipe.
6. Delete an own recipe if needed, then log out.

### 11. Error and Edge Case Handling

Login and registration errors appear in their forms. Failed API requests show an error message. Loading messages appear while reading data, and empty lists show a short explanation.

Missing recipes show Recipe not found. Unknown routes show Page not found with a Home link. Broken recipe images use a local fallback. Invalid stored session JSON is discarded. Delete errors keep the recipe visible so the user can try again. Guests cannot open private pages, and users cannot edit another author's recipe.

## Deployment

The frontend is hosted on Vercel and Supabase hosts the backend. Vercel uses `npm run build` and publishes the dist folder. Both VITE_SUPABASE environment values must be set before building. vercel.json sends direct React route visits to index.html. In Supabase Auth URL Configuration, the Site URL is the public frontend address.
