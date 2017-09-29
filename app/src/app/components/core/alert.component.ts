import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AlertHelper } from '../../helpers/alert-helper';
import { AlertState } from '../../helpers/show-state';

import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';

@Component( {
	selector: 'app-alert',
	templateUrl: '../../views/core/alert.view.html'
} )

export class AlertComponent implements OnInit {
	showAlert : boolean = false;

	alertSubject : string;
	alertBody : string;
    reauthorize : boolean = false;
    loginForm : FormGroup;
    showErrors : boolean = false;
    showValidatorErrors : boolean = false;
    formErrors = new Array;

	private subscription: Subscription;

	constructor(
        private alertHelper: AlertHelper,
        protected router: Router,
        private authenticationService: AuthenticationService,
        private formBuilder: FormBuilder
    ) {
        this.createForm();
    }

    createForm() {
        this.loginForm = this.formBuilder.group( {
            username : [ localStorage.getItem( environment.storage.current_user ), [Validators.required, Validators.minLength(3)] ],
            password : [ "", [Validators.required, Validators.minLength(3)] ]
        } );
    }

	ngOnInit() { 
        this.subscription = this.alertHelper.alertState
            .subscribe((state: AlertState) => {
                this.showAlert = state.show;
                this.alertSubject = state.subject;
                this.alertBody = state.body;
                this.reauthorize = state.reauthorize;
            });
    }

	ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    closeAlert() {
        this.showAlert = false;
        if ( this.reauthorize ) {
            this.router.navigate( ["/logout"] );
        }
    }

    login() {
        this.formErrors = new Array;
        this.showErrors = true;
        this.showValidatorErrors = true;
        if ( this.loginForm.valid ) {
            this.showErrors = false;
            this.showValidatorErrors = false;
            this.authenticationService.login( this.loginForm.get('username').value, this.loginForm.get('password').value, true )
                .subscribe(
                    data => {
                        if ( data.data.errors ) {
                            this.formErrors = data.data.errors;
                        } else {
                            this.alertHelper.hide();
                            window.location.reload();
                        }
                    },
                    error => {
                        this.formErrors.push(error);
                        this.showErrors = true;
                        this.showValidatorErrors = true;
                    },
                    () => {
                        this.showErrors = true;
                        this.showValidatorErrors = true;
                    }
                );
        }
    }
}