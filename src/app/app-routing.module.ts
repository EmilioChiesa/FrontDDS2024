import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/auth.guard';
import { ContactoComponent } from './contacto/contacto.component';

//Se encarga del enrutamiento de la aplicacion 
const routes: Routes = [
  { path: 'login', component: LoginComponent }, //Define la ruta /login para el acceso al LoginComponent
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, //Define la ruta para DashboardComponent
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //En caso de querer acceder a la raiz nos redigije a /login
  { path: 'contacto', component: ContactoComponent } //Define la ruta para ContactoComponent
];

//Importa los modulos necesarios
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
