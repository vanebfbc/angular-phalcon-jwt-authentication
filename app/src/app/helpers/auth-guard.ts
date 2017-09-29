import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { environment } from '../../environments/environment';
 
@Injectable()
export class BaseAuthGuard {
	constructor( protected router: Router ) {}

	protected isCurrentUserValid() : boolean {
        let currentUser = localStorage.getItem( environment.storage.current_user );
        let securityToken = localStorage.getItem( environment.storage.security_token );
        return ( currentUser && securityToken && this.isValidUser( currentUser, securityToken ) );
    }

	protected isValidUser( currentUser : string, securityToken :string ) : boolean {
    	try {
    		let userObj = JSON.parse( securityToken );
    		let user = {
    			user: userObj.user,
    			jwt: userObj.jwt
    		};
            if ( currentUser == user.user )
    		    return true;
    	} catch (e) {}
    	return false;
    }
}

export class AuthGuard extends BaseAuthGuard implements CanActivate {
    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {
 		if ( this.isCurrentUserValid() ) return true;

        this.router.navigate( ['/login'], { queryParams: { returnUrl: state.url } } );
        return false;
    }
}


export class LoggedInAuthGuard extends BaseAuthGuard implements CanActivate {
	canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {
 		if ( ! this.isCurrentUserValid() ) return true;

        this.router.navigate( [''] );
        return false;
    }
}