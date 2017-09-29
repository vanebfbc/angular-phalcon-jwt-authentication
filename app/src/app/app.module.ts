import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { CoreModule } from './modules/core.module';
import { DashboardModule } from './modules/dashboard.module';

import { AuthGuard, LoggedInAuthGuard } from './helpers/auth-guard';
import { RequestOptionsProvider } from './helpers/request-options';
import { HttpServiceProvider } from './helpers/http-service-provider';
import { LoaderHelper } from './helpers/loader-helper';
import { AlertHelper } from './helpers/alert-helper';

import { BaseService } from './services/base.service';
import { AuthenticationService } from './services/authentication.service';

import { AppRoutes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    AppRoutes,
    CoreModule,
    DashboardModule
  ],
  providers: [
    RequestOptionsProvider,
    HttpServiceProvider,
    AuthGuard, 
    LoggedInAuthGuard,
    LoaderHelper,
    AlertHelper,
    BaseService,
    AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
