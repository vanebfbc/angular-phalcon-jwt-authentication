import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { AlertState } from './show-state';

@Injectable()

export class AlertHelper {
	private alertSubject = new Subject<AlertState>();

	alertState = this.alertSubject.asObservable();

	constructor() { }

	show( subject : string, body : string, reauthorize : boolean = false, username : string = "" ) {
        this.alertSubject.next(<AlertState>{show: true, subject: subject, body: body, reauthorize: reauthorize, username: username});
    }

	hide() {
		this.alertSubject.next(<AlertState>{show: false, subject: '', body: '', reauthorize: false});
    }
}