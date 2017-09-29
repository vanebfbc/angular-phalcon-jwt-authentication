import { Routes, RouterModule } from '@angular/router';
 
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { DashboardBaseComponent } from '../components/dashboard/dashboard-base.component';

import { AuthGuard } from '../helpers/auth-guard';

export const DashboardRoutes: Routes = [
	{ path: '', component: DashboardComponent, canActivate: [AuthGuard],
		children: [
			{ path: '', component: DashboardBaseComponent }
		]
	}
];
