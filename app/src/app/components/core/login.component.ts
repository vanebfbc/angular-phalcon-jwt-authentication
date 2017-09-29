import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';

@Component( {
	selector: 'app-login-cmp',
	templateUrl: '../../views/core/login.view.html'
} )

export class LoginComponent implements OnInit, OnDestroy {
	showForm : boolean = false;
	showErrors : boolean = false;
	showValidatorErrors : boolean = false;
	showExpiryError : boolean = false;
	formErrors = new Array;
	returnUrl : string;
	loginForm : FormGroup;
	userName : string = "";
	valuechangeSubscription : Subscription;

	constructor( 
		private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private formBuilder: FormBuilder ) {

		this.userName = localStorage.getItem( environment.storage.current_user );
		this.createForm();
	}

	createForm() {
		this.loginForm = this.formBuilder.group( {
			username : [ this.userName, [Validators.required, Validators.minLength(3)] ],
			password : [ "", [Validators.required, Validators.minLength(3)] ]
		} );
	}

	ngOnInit() {
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
		this.authenticationService.serviceCheck().subscribe(
			data => {
				if ( data.status === 200 ) {
					this.showForm = true;
					if ( localStorage.getItem( environment.storage.session_expiry ) ) {
						localStorage.removeItem( environment.storage.session_expiry );
						this.showExpiryError = true;
					}
				}
			},
			err => {
			}
		);
		this.valuechangeSubscription = this.loginForm.valueChanges.subscribe(
			val => {
				this.showValidatorErrors = false;
				this.showExpiryError = false;
			} 
		);
	}

	ngOnDestroy() {
		this.valuechangeSubscription.unsubscribe();
	}

	login() {
		this.showExpiryError = false;
		this.formErrors = new Array;
		this.showErrors = true;
		this.showValidatorErrors = true;
		if ( this.loginForm.valid ) {
			this.showForm = false;
			this.showErrors = false;
			this.showValidatorErrors = false;
			this.authenticationService.login( this.loginForm.get('username').value, this.loginForm.get('password').value )
				.subscribe(
	                data => {
	                    this.router.navigate( [this.returnUrl] );
	                    if ( data.data.errors ) {
	                    	this.formErrors = data.data.errors;
	                    }
	                },
	                error => {
	                	this.formErrors.push(error);
	                	this.showErrors = true;
	                	this.showValidatorErrors = true;
	                },
	                () => {
	                	this.showForm = true;
	                	this.showErrors = true;
	                	this.showValidatorErrors = true;
	                }
	            );
		}
	}
}