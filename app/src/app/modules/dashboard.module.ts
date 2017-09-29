import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { DashboardBaseComponent } from '../components/dashboard/dashboard-base.component';

import { DashboardService } from '../services/dashboard.service';

@NgModule({
    imports: [
    	CommonModule, 
    	RouterModule
    ],
    declarations: [
    	DashboardComponent,
        DashboardBaseComponent
    ],
    exports: [
    	DashboardComponent
    ],
    providers: [
        DashboardService
    ]
})

export class DashboardModule { }
