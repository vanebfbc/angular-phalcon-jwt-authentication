import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AuthenticationService } from '../../services/authentication.service';

@Component( {
  template: ''
} )

export class LogoutComponent implements OnInit {

	constructor(
        private router: Router,
        private authenticationService: AuthenticationService, ) {}

	ngOnInit() {
		
		this.authenticationService.logout().subscribe(
			data => {
				this.router.navigate( ['login'] );
			}
		);
	}


}