# How to install the project:
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
Now, inside the .env created you have to set up the database configuration, for example:
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
