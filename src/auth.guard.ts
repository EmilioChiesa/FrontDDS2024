import { Injectable } from '@angular/core'; //Se importan los depedencias necesarias
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

//Guard para proteger las rutas de el acceso de usuarios no autenticados
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  //Se inyecta el AuthService
  constructor(private authService: AuthService, private router: Router) {}

  //Metodo para verificar la autenticacion del usuario
  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe( //Se llama al metodo LoggedIn de AuthService
      map(loggedIn => {
        if (!loggedIn) { //Si LoggedIn devuelve falso redirige hacia /login
          this.router.navigate(['/login']); //Mediante este metodo se hace la redireccion
          return false; //De esta manera deniega el permiso para usar otras partes de la aplicacion si es que no esta logueado
        }
        return true; //En caso cotrario permite navegar y usar las funcionalidades de manera normal.
      })
    );
  }
}
