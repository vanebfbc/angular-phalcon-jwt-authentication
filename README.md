# Angular 4 and Phalcon (PHP) JWT Authentication
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

### JWT Library
There are several [JWT libraries](https://jwt.io/) to choose from. In my example, [Firebase JWT](https://github.com/firebase/php-jwt) is used and is included in the code. You are welcome to try anything else!

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
The login post request submits credentials through JSON, so we can obtain the values the Phalcon way:
```php
$credentials = $app->request->getJsonRawBody();
$username = $credentials->username;
$password = $credentials->password;
```

We then use our DbHandler to find if the user exists and if password is correct. In production the handler should be connecting to a database instance directly. Once we find out the user is valid, then it's time to create the JWT for the user. Since we are using a two-step verification process, we create a JWT ID (JTI) to be part of the data payload. JTI can be anything from a sequence id to a random string as long as it's unique. Save this to the current user's cookie ('asuid' means Authenticated Session User ID).

```php
$time = time();
$jti = bin2hex( random_bytes( 32 ) ) . "-" . bin2hex( $username );
$app->cookies->set(
  "asuid",
  $jti,
  $time + 28800
);
```

Notice I have set an expiration time for the cookie (8 hours). Unless you want the user to remain logged in indefinitely, it's a good practice to always set an expiry time for your cookie.

Next we create the data payload. Refer to the [guidelines of JWT](https://tools.ietf.org/html/draft-jones-json-web-token-07) to construct your data array; pay attention to reserved claims.

```php
$time = time();
$tokenData = array(
  "iss" => "Angular Phalcon JWT", // Issued by (entity)
  "iat" => $time, // Issued at (time)
  "nbf" => $time, // Not valid before (time)
  "exp" => $time + 28800, // Expired at (time)
  "jti" => $jti, // JWT ID
  // ...any othe custom cliams
);

```

Finally, generate the JWT using the Firebase library.

```php
use Firebase\JWT\JWT;

$jwt = JWT::encode(
  $tokenData,
  $key, // Your secret key
  'HS512' // Algorithm
);
```

Remember to include the JWT string in the response body so the frontend can use it in the subsequent requests.

### JWT Validation
JWT is validated in index.php as it controls all routings. I think it might be a better idea to separate the validation logic in a separate file, but for the time being this will do. The following code excludes some routes from JWT validation:

```php
$jwtExempt = in_array( ltrim( $_SERVER['REQUEST_URI'], "/" ), 
	array(
    'login',
    'logout',
    'service-check'
	) 
);

if ( !$jwtExempt ) {
  // Validation required
}

```

Since JWT is sent throught the header "Authorization", we can get it and strip it of the preceeding "Bearer" from the following code:

```php
$jwt = $di->getRequest()->getHeader( "Authorization" );
if ( $jwt ) {
  $prefix = "Bearer ";
  if ( substr( $jwt, 0, strlen( $prefix ) ) == $prefix ) {
    $jwt = trim( substr( $jwt, strlen( $prefix ) ) );
  }
}
```

Now that we have the JWT from request, we validate it in two steps:

**Step 1**: Decode with the Firebase JWT library. Note that unsuccessful decode will raise an exception, so we need to catch it. Specifically, ExpiredException is raised if the "exp" time is past, and SignatureInvalidException is raised if signature does not match the payload.

**Step 2**: Use JTI to validate the current active user. During JWT generation, JTI is also saved as a cookie id for the authentiated session user ("asuid"); if the two values don't match, it means the current user is changed or is using an invalid JWT.

```php
use Firebase\JWT\JWT;

$valid = false;
try {
  $key = $secretKey;
  $token = JWT::decode( $jwt, $key, array('HS512') );
  // JWT is valid, now compare JTI
  if ( $cookies->get( "asuid" ) == $token->jti ) {
    // JTI is valid
    $valid = true;
  }
  
} catch ( Firebase\JWT\ExpiredException $e ) {
  // If JWT has expired
} catch ( Firebase\JWT\SignatureInvalidException $e ) {
  // If signature does not match payload data
} catch ( Exception $e ) {
  // Anything else
}
```

Depending on whether the route requires JWT validation and validation results, content can be delivered accordingly.

### A Few Words About Security
(1) Authentication is all about security. In the AuthenticationController, we have the following unhashed comparison for password:
```php
if ( $password == $user->password ) {
  // Authentication successful
}
```
This is not a good practice in terms of security. Remember to hash your passwords in production environment.

(2) JWT uses a secret key to encode the token signature; this key is loaded through a config file in the project, but you can also store it in a database.

(3) JTI can be anything as long as you can ensure its uniqueness during your operation timeframe.

(4) In root index.php, $di registers a 'crypt' service which uses an encryption key to encrypt cookies set by the backend. This prevents XSS attacks as long as your key is very hard to crack. Alternatively, you can set your cookies to be HttpOnly.


## Further Readings
[Jason Watmore's Blog](http://jasonwatmore.com/post/2016/08/16/angular-2-jwt-authentication-example-tutorial)

[Phalcon Documentation](https://docs.phalconphp.com/en/3.2)

## Notes
You are free to use this code in your projects as long as you credit the source, as required by MIT License. If you have further questions, you can reach me at danielchen4312@gmail.com.

