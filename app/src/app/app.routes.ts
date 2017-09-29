import { Routes, RouterModule } from '@angular/router';
import { CoreRoutes } from './routes/core.routes';
import { DashboardRoutes } from './routes/dashboard.routes';

const appRoutes: Routes = [
	...DashboardRoutes,
	...CoreRoutes,
    { path: '**', redirectTo: '404' }
];
 
export const AppRoutes = RouterModule.forRoot( appRoutes );