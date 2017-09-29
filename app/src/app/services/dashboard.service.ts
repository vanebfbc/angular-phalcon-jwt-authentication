import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from './base.service';
import { environment } from '../../environments/environment';

@Injectable()

export class DashboardService extends BaseService {
	initializeDashboard() {
		let branchID = localStorage.getItem( environment.storage.active_branch );
		return this.http.post( this.api_url + 'initialize-dashboard', { branch: branchID }  );
	}
	switchBranch(branchID) {
		return this.http.post( this.api_url + 'switch-branch', { branch: branchID } );
	}
}