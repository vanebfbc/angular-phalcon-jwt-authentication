# Angular Phalcon JWT Authentication
This repository demonstrates how to implement JWT (JSON Web Token) authentication with Angular 4+ frontend and PHP REST API (Phalcon Micro) backend. It is already used in a project in poduction and I would like to share how it's done. To run this, you need to have a server that runs PHP. The source code contains two parts: frontend (Angular 4, in the 'app' directory), and backend (PHP running on Phalcon, in the 'web' directory). This project is inspired by Jason Watmore's [blog post](http://jasonwatmore.com/post/2016/08/16/angular-2-jwt-authentication-example-tutorial).

My development environment as of September 28th, 2017:
- Apache 2.4.2 running mod_fcgid
- PHP 7.1
- Phalcon 3.2
- PHP-JWT (Firebase) 5.0.0
- Angular 4.3.6
- Angular-Cli 1.2.6

Actual production also includes Redis cache and PotgreSQL database integration which will not be discussed here.

## Features
Frontend:
- Elegant and secure authentication
- Send JWT with every request
- Loading animation with all ajax requests
- Clear JWT upon logout
- SCSS

Backend:
- REST API using Phalcon Micro
- Create JWT on user login
- Validate JWT for user and time
- Double validate user using JTI (JWT ID) Claim

## Before You Start
You should have some knowledge of Typescript, Angular 4 and PHP Phalcon framework before you go in depth into the code. It is also suggested to have the basic understanding of how REST works.

If you have not set up a server to test locally, you can easily install [XAMPP](https://www.apachefriends.org/index.html) or [WAMP](http://www.wampserver.com/en/) (Windows only) using their download packages so you can run PHP on the go. Install [Node and NPM](https://nodejs.org/en/) if you have not done so already.

Install [Phalcon](https://phalconphp.com/en/) and make sure it's properly loaded.

After grabbing the source code, open the terminal on your project folder and navigate to the 'app' directory. Install all of the essential node packages.

```bash
cd app
npm install
```

Most importantly, make sure you have installed Angular-cli to run and build the application.

```bash
npm install -g @angular/cli
```

Now, you should be able to start the application by running the following command and open http://localhost:4200/ in your browser.

```bash
ng serve
```

The PHP backend is inside the 'web' directory, so you should have your server set up a url that points to the folder. This is your REST endpoint url. Add this url to your Angular environment variable as 'api_url' under 'app/src/environments/environment.ts' like the following:

```typescript
export const environment = {
  ...
  api_url: "http://angular-phalcon-jwt.localhost.com/",
  ...
};

```

Now, try logging in with the following two credentials:

Username: johndoe

Password: 1234

Or

Username: janesmith

Password: 5678

## Frontend (/app)

## Backend (/web)
Phalcon Micro provides an easy way to start a REST application. All of the backend magic happens in the index.php file, as long as routes are defined to handle any incoming requests.

```php
use Phalcon\Mvc\Micro;
use Phalcon\Di\FactoryDefault;

$di = new FactoryDefault();
$app = new Micro( $di );

// All other codes goes here

$app->handle();
```

### In-memory Database
For demonstration purposes, the user database is coded into the helper class **DbHandler**. There are two user entries: johndoe and janesmith. The load_user() method will attempt to find the user with a username supplied.

### Output JSON
Angular works very well with JSON, so the backend requests should always output JSON. Use $app->response->setsetJsonContent() method to convert any response into JSON format. **JsonMessageConstructor** is a custom helper class which constructs response array with necessary data payload for my application.

### Routes
Routes are defined in the following way:
```php
use Phalcon\Mvc\Micro\Collection;

$routes = new Collection();
$routes->setHandler( 'CustomRoutesController', true );
$routes->get( '/get-route', 'getMethod' );
$routes->post( '/post-route', 'postMethod' );
$app->mount( $routes );
```

I defined two controllers to handle the routes: **AuthenticationController**, which handles login and logout logic, and **DashboardController**, which handles content delivery upon login. JWT validation logic happens in index.php because it's where the routes are defined; I can filter which routes require authentication and which ones don't. Each of the controllers handles two routes respectively.

**AuthenticationController**:

"/login": (POST) JWT is not required to access this route. Takes in username and password pair and generates a JWT upon successful login.

"/logout": (GET) JWT is not required. Clears session cookie of logged-in user.

**DashboardController**:

"/service-check": (GET) JWT is not required. This optional method let user know if the API server is up.

"/initialize-dashboard": (GET or POST) JWT is required to access. In other words, users not authenticated should not access the dashboard at all.

### Login / JWT Generation

### JWT Validation

## Further Readings
[Jason Watmore's Blog](http://jasonwatmore.com/post/2016/08/16/angular-2-jwt-authentication-example-tutorial)

[Phalcon Documentation](https://docs.phalconphp.com/en/3.2)

## Notes
You are free to use this code in your projects as long as you credit the source, as required by MIT License. If you have further questions, you can reach me at danielchen4312@gmail.com.

