<?php 

class JsonMessageConstructor {

	public function create( $payload = array(), $success = true, $status = 200, $message = "OK" ) {
		$dataArray = array(
			"status" => $status,
			"success" => $success
		);
		if ( $message ) {
			$dataArray['message'] = $message;
		}
		if ( $payload ) {
			$dataArray['data'] = $payload;
		}

		return $dataArray;
	}

}