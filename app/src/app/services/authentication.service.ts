import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from './base.service';
import { environment } from '../../environments/environment';

@Injectable()

export class AuthenticationService extends BaseService {
	login( username: string, password: string, keepAlert : boolean = false ) {
		return this.http.post( this.api_url + 'login', JSON.stringify( { username: username, password: password } ) )
			.map( ( response : Response ) => {
				let result = response.json();
				if (result && result.status === 200 && result.success && result.data) {
					localStorage.setItem( environment.storage.security_token, JSON.stringify( result.data ) );
					localStorage.setItem( environment.storage.current_user, result.data.user );
                }
                return result;
			} );
	}

	logout() {
		localStorage.removeItem( environment.storage.security_token );
		return this.http.get( this.api_url + 'logout' ).map( ( response : Response ) => {
			let result = response.json();
            return result;
		} );
		
	}

	register( username: string, email: string, password: string ) {
		return this.http.post( this.api_url + 'register', JSON.stringify( { username: username, email: email, password: password } ) )
			.map( ( response : Response ) => {
				return response.json();
			} );
	}
}