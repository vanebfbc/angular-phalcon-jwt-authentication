import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DashboardService } from '../../services/dashboard.service';

import { environment } from '../../../environments/environment';

@Component( {
	templateUrl: '../../views/dashboard/dashboard.view.html'
} )

export class DashboardComponent implements OnInit, OnDestroy {
	showDashboard : boolean = false;

	username : string;

	constructor(
		private dashboardService : DashboardService,
		public router : Router,
		private renderer : Renderer2
	) {}
	
	ngOnInit() {
		let currentUser = localStorage.getItem( environment.storage.current_user );
		this.username = currentUser ? currentUser : "Guest";

		this.dashboardService.initializeDashboard().subscribe(
			data => {
				if ( data.status === 200 ) {
					this.showDashboard = true;
					this.renderer.addClass(document.body, 'logged-in');
				} else {
					this.showDashboard = false;
					this.renderer.removeClass(document.body, 'logged-in');
				}
			},
			err => {

			}
		);
	}

	ngOnDestroy() {
		this.renderer.removeClass(document.body, 'logged-in');
	}

}