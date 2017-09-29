<?php 

class DbHandler {

	private $users = array();

	function __construct() {
		$user = (object) array(
			"id" => 1,
			"username" => "johndoe",
			"password" => "1234",
			"name" => "John Doe"
		);
		$this->users[] = $user;
		$user = (object) array(
			"id" => 2,
			"username" => "janesmith",
			"password" => "5678",
			"name" => "Jane Smith"
		);
		$this->users[] = $user;
	}

	public function load_user( $username = "" ) {
		$loaded_user = false;
		if ( $username ) {
			foreach ( $this->users as $user ) {
				if ( $username == $user->username ) {
					$loaded_user = $user;
				}
			}
		}

		return $loaded_user;
	}
}