//Importamos todos los modulos necesarios
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { TokenInterceptor } from './interceptor-logout.interceptor';
import { ContactoComponent } from './contacto/contacto.component';

//Indicamos los metadatos para el modulo dentral
@NgModule({
  //Se declaran los componentes de la aplicacion
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ContactoComponent
  ],
  //Se importan los modulos
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
  ],
  //Se indica el uso del interceptor
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },],
  //Se indica el uso de boostrap
  bootstrap: [AppComponent]
})
export class AppModule { }
