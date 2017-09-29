import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { environment } from '../../environments/environment';

@Injectable()

export class DefaultRequestOptions extends BaseRequestOptions {
	constructor() {
    	super();
    	this.withCredentials = true;
    }

    merge(options?: RequestOptionsArgs): RequestOptions {
		let newOptions = super.merge( options );
		try {
	    	let securityToken = localStorage.getItem( environment.storage.security_token );
	    	let userObj = JSON.parse( securityToken );

	    	if ( userObj.jwt ) {
	    		let authHeader = 'Bearer ' + userObj.jwt;
	    		newOptions.headers.set( 'Authorization', authHeader );
	    	}
	    } catch (e) {}
		return newOptions;
	}
}

export const RequestOptionsProvider = { provide: RequestOptions, useClass: DefaultRequestOptions };