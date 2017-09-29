<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/helpers/JsonMessageConstructor.php';
require_once __DIR__ . '/helpers/DbHandler.php';

use Phalcon\Loader;
use Phalcon\Mvc\Micro;
use Phalcon\Mvc\Micro\Collection as MicroCollection;
use Phalcon\Di\FactoryDefault;
use Phalcon\Config\Adapter\Ini as ConfigIni;
use Phalcon\Db\Adapter\Pdo\Postgresql as PostgresqlDb;
use Phalcon\Session\Adapter\Files as Session;
use Phalcon\Cache\Backend\Redis;
use Phalcon\Cache\Frontend\Data as FrontData;
use Phalcon\Http\Response\Cookies;
use Phalcon\Crypt;
use Phalcon\Security;
use Firebase\JWT\JWT;

// Register models and controllers
$loader = new Loader();
$loader->registerDirs( array(
    __DIR__ . '/controllers/'
) )->register();

// Dependency injection container
$di = new FactoryDefault();

// Configs
$is_devel = true;
$config = new ConfigIni( __DIR__ . '/config/development.ini' );

$di->setShared(
	'config',
	$config
);

// Mock database
$di->set(
	"db",
	function() {
		return new DbHandler();
	}
);

$di->setShared(
    'session',
    function () {
        $session = new Session();
        $session->start();
        return $session;
    }
);

// Security
$di->set(
    "crypt",
    function () use ($di) {
        $crypt = new Crypt();
        $crypt->setKey( $di->get('config')->security->cryptkey );
        return $crypt;
    }
);

$di->setShared(
	"json",
	function() {
		return new JsonMessageConstructor();
	}
);

$di->set(
	"settings",
	"SettingsManager"
);

$app = new Micro( $di );

// Set CORS for development testing ONLY.
if ( $is_devel ) {
	$origin = $app->request->getHeader( "ORIGIN" ) ? $app->request->getHeader( "ORIGIN" ) : '*';
	$app->response->setHeader( "Access-Control-Allow-Origin", $origin )
		->setHeader( "Access-Control-Allow-Credentials", "true" );
	$app->options( '/{catch:(.*)}', function() use ($app) { 
	    $app->response
	    	->setHeader( "Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type, Authorization' )
	    	->setHeader( "Access-Control-Allow-Methods", 'GET, POST, OPTIONS, PUT, DELETE, PATCH' )
		    ->setStatusCode(200, "OK")->send();
		    exit;
	} );
}

// Check authorization, except when logging in/out and registering
$jwt = $di->getRequest()->getHeader( "Authorization" );
$jwtExempt = in_array( ltrim( $_SERVER['REQUEST_URI'], "/" ), 
	array(
		'login',
		'register',
		'logout',
		'service-check'
	) 
);
if ( !$di->getRequest()->isOptions() && !$jwtExempt ) {
	$jwtValid = $reauthorizeAllowed = $token = false;
	if ( $jwt ) {
		$prefix = "Bearer ";
		if ( substr( $jwt, 0, strlen( $prefix ) ) == $prefix ) {
		    $jwt = trim( substr( $jwt, strlen( $prefix ) ) );
		} 
		$cookies = $di->get('cookies');
		try {
			$key = base64_decode( $di->get("config")->security->jwtsecret );
			$token = JWT::decode( $jwt, $key, array('HS512') );
			if ( $token ) {
				if ( $cookies->has( "asuid" ) ) {
					if ( $cookies->get( "asuid" ) == $token->jti ) {
						$jwtValid = true;
						$app->session->set( 'uid', $token->uid );
						$app->session->set( 'cid', $token->cid );
						// Refresh active user for 1 hour
						$cookies->set(
				            "aun",
				            $token->user,
				            time() + 3600
				        );
					}
				}
				if ( $cookies->has( "aun" ) ) {
					$reauthorizeAllowed = true;
				}
			}
		} catch ( Firebase\JWT\ExpiredException $e ) {
			if ( $cookies->has( "aun" ) ) {
				$reauthorizeAllowed = true;
			}
		} catch ( Firebase\JWT\SignatureInvalidException $e ) {
		} catch ( Exception $e ) {
		}
	}
	if ( !$jwtValid ) {
		$reauthorizeArray = array( "reauthorize" => $reauthorizeAllowed );
		$di->getResponse()
		->setJsonContent(
			$di->get("json")->create(
				$reauthorizeArray, false, 401, "Unauthorized"
			)
		)
		->setStatusCode( 401, "Unauthorized" )->send();
		exit;
	}
}

$dashboardRoutes = new MicroCollection();
$dashboardRoutes->setHandler( 'DashboardController', true );
$dashboardRoutes->get( '/service-check', 'serviceCheck' );
$dashboardRoutes->post( '/initialize-dashboard', 'initializeDashboard' );
$app->mount( $dashboardRoutes );

$authenticationRoutes = new MicroCollection();
$authenticationRoutes->setHandler( 'AuthenticationController', true );
$authenticationRoutes->post( '/login', 'login' );
$authenticationRoutes->get( '/logout', 'logout' );
$app->mount( $authenticationRoutes );

$app->notFound(
    function () use ($app) {
        $app->response
			->setJsonContent( 
				$app->json->create(
					null, false, 404, "Not Found"
				)
			)
			->setStatusCode( 404, "Not Found" )->send();
		exit;
    }
);

$app->handle();
