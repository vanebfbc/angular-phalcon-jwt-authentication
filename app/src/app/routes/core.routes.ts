import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../components/core/login.component';
import { LogoutComponent } from '../components/core/logout.component';
import { NotFoundComponent } from '../components/core/not-found.component';

import { LoggedInAuthGuard } from '../helpers/auth-guard';

export const CoreRoutes: Routes = [
	{ path: 'login', component: LoginComponent, canActivate: [LoggedInAuthGuard] },
	{ path: 'logout', component: LogoutComponent },
	{ path: '404', component: NotFoundComponent }
];