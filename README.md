# Challenge-LW

## How to install the project:

Open the terminal inside the folder you want to put the project.

Clone the repository:

```
 git clone https://github.com/CalebeCopello/Challenge-LW
```

Let's set up the backend, first you enter the /backend folder

```
cd backend/
```

Now you just install the dependencies

```
composer install
```

Create the .env to the project

```
cp .env.example .env
php artisan key:generate
```

Now, inside the .env created you have to set up the database configuration, eg:

```
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_challenge
DB_USERNAME=calebe
DB_PASSWORD=123abc
```

Now run the migrations to create the tables:

```
php artisan migrate
```

We can now create the jwt secret key

```
php artisan jwt:secret
```

Let's create an user to test the login route:

```
php artisan tinker
User::factory()->create()
```

Take note of the email of the user (eg, okuneva.lelia@example.org). The default password is: "password".

We can start the backend server with:

```
php artisan serve
```

Now it's time to set up the frontend, open a new terminal and go to the frontend folder

```
cd frontend/
```

Now let's install the node dependencies

```
npm i
```

And we can run the frontend server:

```
npm run dev
```

## Documentation:

### Project Overview

The project is a web application developed with Nextjs, a React, Laravel for backend, a SQL database and JWT to authenticate the user.

### Architecture

The project architecture tries to follo the MVC (Model-View-Controller) pattern for separation of concerns.

1. Model: Models represent the application's data, such as products and users. In the backend, these models are defined using an ORM (Object-Relational Mapping) like Eloquent in Laravel.
2. View: Views are built with React with TypeScript (.tsx). Pages are rendered on the server using Nextjs providing better performance.
3. Controller: Controllers handle HTTP request, interact with models and send the necessary data to views. In the backend, these controllers are implemented using routes in Laravel.

### Backend

The backend of the project is developed with Laravel, a modern and robust PHP framework. Here are some technical decisions made for the backend:

- Authentication: Authentication is implemented using JWT (JSON Web Tokens), which are generated when users log in.

- RESTful API: The backend exposes a RESTful API for communication with the frontend.

- SQL Database: The project uses MySql/MariaDB Database to store information such as users information (with encrypted password), and products information.

### Frontend

The frontend of the project is built with Next.js and React.js with TypeScript. Here are some technical decisions made for the frontend:

- SSR (Server-Side Rendering): Next.js is used to render pages on the server. This improves the performancer.

- State Management: Application state is primarily managed by React's useState. Making the page more dynamic for the user.

- Styling: Styling is done mainly with styling library Tailwind CSS. And using the Flowbite React a UI library.

### Deployment and Hosting

The project can be deployed on hosting platforms compatible with PHP and Node.js, and that accept SQL Database.

### Conclusion

This document provides an overview of the design and technical decisions made in the project. It serves as a useful reference for understanding the architecture of the application, and its underlying technologies.
