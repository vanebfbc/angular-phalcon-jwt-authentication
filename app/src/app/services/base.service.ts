import { Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()

export class BaseService {

	protected api_url : string = environment.api_url;
    
    constructor( protected http : Http ) {}

    serviceCheck() {
		return this.http.get( this.api_url + 'service-check' );
	}
}