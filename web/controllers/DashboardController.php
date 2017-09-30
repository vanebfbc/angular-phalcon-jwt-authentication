<?php

use Phalcon\Mvc\Controller;

class DashboardController extends Controller
{
	public function serviceCheck() {
		$this->response
			->setJsonContent( 
				$this->json->create(
					array( "ok" => true ), true
				)
			)
			->setStatusCode( 200, "OK" );
		return $this->response;
	}

	public function initializeDashboard() {
		$this->response
			->setJsonContent( 
				$this->json->create(
					array( "ok" => true ), true
				)
			)
			->setStatusCode( 200, "OK" );
		return $this->response;
	}

}