import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';


import { LoaderHelper } from '../helpers/loader-helper';
import { AlertHelper } from '../helpers/alert-helper';

import { environment } from '../../environments/environment';

@Injectable()

export class DefaultHttpServiceProvider extends Http {
	public pendingRequests: number = 0;
	keepAlert = false;

	constructor(
		backend: XHRBackend, 
		defaultOptions: RequestOptions, 
		private loaderHelper: LoaderHelper,
		private alertHelper : AlertHelper,
		protected router: Router ) {
		super(backend, defaultOptions);
	}

	request( url: string | Request, options?: RequestOptionsArgs ): Observable<Response> {
		this.showLoader();
		return this.intercept(super.request(url, options));
	}

	intercept( observable: Observable<Response> ): Observable<Response> {
		this.pendingRequests ++;
		return observable
			.catch( this.onCatch )
			.do( ( res: Response ) => {
				this.onSuccess( res );
			}, ( err: any ) => {
				this.onError( err );
			} )
			.finally( () => {
				this.onEnd();
			} );
	}

	// May implement handlers in the future
	onSuccess( res: Response ) {
	}
	onCatch( err: any, observable: Observable<Response> ) :any {
		if ( err ) {
			if ( err.status === 0 ) {
				err.status = 500;
				err.statusText = 'Internal Server Error';
			}
			throw(err);
		}
	}
	onError( err: any ) {
		let subject : string = "", body : string = "", reauthorize : boolean = false, name : string = "";
		if ( err && err.status ) {
			subject = err.status + ": " + err.statusText;
			switch (err.status) {
				case 401:
					body = "Your session has expired. Please login again.";
					let data = err.json();
					if ( data.data && data.data.reauthorize ) {
						reauthorize = true;
						if ( data.data.username ) {
							name = data.data.username
						}
						subject = "Session Expired";
					} else {
						localStorage.setItem( environment.storage.session_expiry, "true" );
						this.router.navigate( ['/logout'] );
						return;
					}
					
				break;
				case 403:
					body = "You are not allowed to access the resources.";
				break;
				case 404:
					body = "Resource is not found.";
				break;
				case 500:
					body = "Server is experiencing some problems. Please try again later.";
				break;
				case 503:
					body = "Server is currently down. Please try again later.";
				break;
				default:
					body = "System is experiencing some problems. Please try again later!";
			}
			this.alertHelper.show( subject, body, reauthorize, name );
		}
	}

	onEnd() {
		this.pendingRequests --;
		if ( this.pendingRequests <= 0 ) {
			this.pendingRequests = 0;
			this.hideLoader();
		}
	}

	private showLoader(): void {
        this.loaderHelper.show();
    }

	private hideLoader(): void {
        this.loaderHelper.hide();
    }
}

export const HttpServiceProvider = { provide: Http, useClass: DefaultHttpServiceProvider };