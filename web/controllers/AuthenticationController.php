<?php

use Phalcon\Mvc\Controller;
use Phalcon\Filter;
use Phalcon\Validation;
use Phalcon\Validation\Validator\Email;
use Firebase\JWT\JWT;

class AuthenticationController extends Controller
{
	public function login() {

		$credentials = $this->request->getJsonRawBody();
		$filter = new Filter();
		$success = false;
		$payload = array();
		$errors = array();
		$invalidFields = array();

		$username = $filter->sanitize( trim( $credentials->username ), 'string' );
		$password = trim( $credentials->password );

		if ( $username && $password ) {

			$user = $this->db->load_user( $username );

			if ( $user ) {
				// Recommanded to implement hashing for password to boost security
				// if ( $this->security->checkHash( $password, $user->password ) ) {
				if ( $password == $user->password ) {
					$key = base64_decode( $this->config->security->jwtsecret );
					$time = time();

					$jti = bin2hex( random_bytes( 32 ) ) . "-" . bin2hex( $user->username );
					$this->cookies->set(
			            "asuid", // Authenticated Session User ID
			            $jti,
			            $time + 28800
			        );
			        $this->cookies->set(
			            "aun", // Active Username
			            $username,
			            $time + 3600
			        );

					$tokenArray = array(
					    "iss" => "Angular Phalcon JWT",
					    "iat" => $time,
					    "nbf" => $time,
					    "exp" => $time + 28800,
					    "jti" => $jti,
					    "cid" => 1,
						"uid" => $user->id,
						"user" => $user->username
					);

					$jwt = JWT::encode(
						$tokenArray,
						$key,
						'HS512'
					);

					$payload["jwt"] = $jwt;
					$payload["user"] = $user->username;
					$success = true;
				} else {
					$errors[] = 'Password does not match.';
					$invalidFields[] = "password";
				}
			} else {
				$errors[] = 'User does not exist.';
				$invalidFields[] = "username";
			}
		} else {
			if ( !$username ) {
				$errors[] = "Username cannot be empty.";
				$invalidFields[] = "username";
			}
			if ( !$password ) {
				$errors[] = "Password cannot be empty.";
				$invalidFields[] = "password";
			}
		}
		if ( $errors ) {
			$payload['errors'] = $errors;
			if ( $invalidFields ) {
				$payload['invalid'] = $invalidFields;
			}
		}
		$this->response->setJsonContent(
			$this->json->create( $payload, $success )
		);
		return $this->response;
	}

	public function logout() {
		$payload = array();
		$userCookie = $this->cookies->get("asuid");
        $userCookie->delete();
        $userCookie = $this->cookies->get("aun");
        $userCookie->delete();
		$this->response->setJsonContent(
			$this->json->create( $payload )
		);
		return $this->response;
	}

	
}