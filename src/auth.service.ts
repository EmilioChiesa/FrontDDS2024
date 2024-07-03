import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3001/auth'; //Toma como base la url del backend a las que le realizaremos peticiones.
  private loggedIn = new BehaviorSubject<boolean>(this.hasValidToken()); //Settea una bandera si estamos logueados con un token valido.

  constructor(private http: HttpClient) {
    // Verificar el estado del token cada cierto intervalo de tiempo
    timer(0, 60000).subscribe(() => {
      this.loggedIn.next(this.hasValidToken());
    });
  }
  
  //Metodo para el logueo
  login(credentials: { email: string, password: string }): Observable<any> { //Recibe email y contraseña
    return this.http.post<any>(`${this.baseUrl}/login`, credentials) //Envia la peticion usando POST para el metodo definido en el backend
      .pipe(
        tap(response => {
          if (response && response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken); //Guarda el access token en local storage
            localStorage.setItem('refreshToken', response.refreshToken); //Guarda el refresh token en local storage
            this.loggedIn.next(true); //Se settea el valor de LoggedIn en verdadero
          }
        })
      );
  }
  //Metodo para registrar usuarios.
  register(data: { email: string, password: string }): Observable<any> { //Recibe los mismos datos que el login
    return this.http.post<any>(`${this.baseUrl}/register`, data); //Envia un POST con estos datos al backend.
  }

  //Metodo para el cerrado de sesion
  logout() {
    localStorage.removeItem('accessToken'); //Se elimina el access token del local storage
    localStorage.removeItem('refreshToken'); //Se elimina el refresh token del local storage
    this.loggedIn.next(false); //Se settea LoggedIn en falso
    window.location.href = '/login'; // Redirige al login al cerrar sesión
  }
  
  //Metodo para obtener el access token almacenado en local storage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  //Metodo para obtener el refresh token almacenado en local storage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
  //Metodo para saber si el usuario esta logueao o no
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  //Metodo para comprobar si el JWT es valido o no
  private hasValidToken(): boolean {
    const accessToken = localStorage.getItem('accessToken'); //Guarda en una constante el token almacenado
    if (!accessToken) { //Si el token no es valido sevuelve falso
      return false;
    }

    // Decodificar el token para obtener la fecha de expiración
    const tokenParts = accessToken.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }

    const decodedToken = JSON.parse(atob(tokenParts[1]));
    const tokenExp = decodedToken.exp * 1000; // Convertir exp a milisegundos

    return tokenExp > Date.now(); // Devuelve true si el token aún no ha expirado
  }
}
