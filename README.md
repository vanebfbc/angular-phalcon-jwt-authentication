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
You should have some knowledge of Typescript, Angular 4 and PHP before you go in depth into the code. It is also suggested to have the basic understanding of how REST works.

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

## Frontend

## Backend

## Further Readings
[Jason Watmore's Blog](http://jasonwatmore.com/post/2016/08/16/angular-2-jwt-authentication-example-tutorial)

[Phalcon Documentation](https://docs.phalconphp.com/en/3.2)

## Notes
You are free to use this code in your projects as long as you credit the source, as required by MIT License. If you have further questions, you can reach me at danielchen4312@gmail.com.

