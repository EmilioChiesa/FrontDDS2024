//Se importan los modulos necesarios para el correcto funcoiamiento
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/auth.service';
import { ActivatedRoute } from '@angular/router';

//Indicamos los metadatos del compoente, su selector, su archivo de estilos y la plantilla html del mismo
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //Indicamos los tipos de datos de la clase
  email: string = ''; //Estos valores los recibimos a traves del formulario en la plantilla html mediante interpolacion
  password: string = ''; //Enlazamos estos datos con los de la plantilla html mediannte ngModel
  errorMessage: string = '';

  //Inyectamos el AuthServices, Router y ActivateRoutes
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => { //Recibe un param del interceptor en caso de que la sesion haya expirado
      if (params['sessionExpired'] === 'true') { //Si el valor del param es vedadedo indica con una alerta que la sesion exxpiro y te redirige a /login
        // Aquí puedes mostrar el pop-up. Este ejemplo usa alert, pero puedes usar cualquier método que prefieras.
        alert('Sesión Expirada');
      }
    });
  }

  //LDefinimos el metodo login
  login(): void {
    if (this.email.trim() === '' || this.password.trim() === '') { //Si el mail y contraseña estan vacios te pide que ingreses esos datos
      this.errorMessage = 'Por favor ingrese su email y contraseña.';
      return;
    }
    //Llamamos al metodo Login de AuthService
    this.authService.login({ email: this.email, password: this.password }).subscribe( //Le pasamos el email y password almacenados en la clase
      () => {
        this.router.navigate(['/dashboard']); //Si el login es correcto te redigire a /dashboard
      },
      (error) => { //En caso ontrario te indica que las credenciales son incorrectas y que vuelvas a intentar el inicio de sesion
        this.errorMessage = 'Error en el inicio de sesión. Por favor, inténtelo de nuevo.';
        console.error(error);
      }
    );
  }
}
