import { Injectable } from '@angular/core'; //Se importan todos los modulos necesarios
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

//Se encarga de interceptar un evento.
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  //Intercepta un evemtp, en este caso el error de las solicitudes cuando expira el JWT
  //Se obtiene el cuerpo de la request
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) { //Si esta devuelve un error 401 Unauthorized 
          this.router.navigate(['/login'], { queryParams: { sessionExpired: 'true' } }); //Nos redirige automaticamente al /login
        }
        return throwError(error);
      })
    );
  }
}