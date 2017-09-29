import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderHelper } from '../../helpers/loader-helper';
import { ShowState } from '../../helpers/show-state';

@Component({
  selector: 'app-loader',
  templateUrl: '../../views/core/loader.view.html'
})

export class LoaderComponent implements OnInit {
	show = false;

	private subscription: Subscription;

	constructor(
        private loaderHelper: LoaderHelper
    ) {}

	ngOnInit() { 
        this.subscription = this.loaderHelper.loaderState
            .subscribe((state: ShowState) => {
                this.show = state.show;
            });
    }

	ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}