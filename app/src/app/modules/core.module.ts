import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../components/core/loader.component';
import { LoginComponent } from '../components/core/login.component';
import { LogoutComponent } from '../components/core/logout.component';
import { NotFoundComponent } from '../components/core/not-found.component';
import { AlertComponent } from '../components/core/alert.component';

@NgModule({
    imports: [
    	CommonModule, 
    	RouterModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
    	LoginComponent,
    	LogoutComponent,
        LoaderComponent,
        AlertComponent,
        NotFoundComponent
    ],
    exports: [
        LoaderComponent,
        AlertComponent,
        NotFoundComponent
    ]
})

export class CoreModule { }
