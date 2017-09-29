import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ShowState } from './show-state';

@Injectable()

export class LoaderHelper {
	private loaderSubject = new Subject<ShowState>();

	loaderState = this.loaderSubject.asObservable();

	constructor() { }

	show() {
        this.loaderSubject.next(<ShowState>{show: true});
    }

	hide() {
        this.loaderSubject.next(<ShowState>{show: false});
    }
}