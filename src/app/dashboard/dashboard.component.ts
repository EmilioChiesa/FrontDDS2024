//Se importan los modulos necesarios para el correcto funcionamiento
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth.service';
import { ProductService } from 'src/product.service';

//Se definen todos los datos del componente
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
//Definimos los diferentes atributos que necesitamos en la realizacion de las funcionalidades
export class DashboardComponent implements OnInit {
  products: any[] = []; //Definimos el aray en el que se almacenan los objetos
  errorMessage: string = '';
  searchName: string = '';
  showSearch: boolean = false;
  isLoggedIn: boolean = false;
  
  //Inyectamos los servicios de AuthService y ProductService
  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) { }

  //Definimos el metodo para saber si estamos logueados o  no
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  //Definimos el metodo para obtener los productos 
  fetchProducts(): void {
    this.productService.getProducts().subscribe( //Llamamos el metodo getProducts de el ProductService
      (data: any[]) => { //Recibe la lista de productos
        this.products = data; //Las guarda en el array definido arriba
        this.errorMessage = '';
      },
      (error: any) => { //En caso de haber error al realizar la solicitud 
        this.errorMessage = 'Error fetching products'; //Enviamos un mensaje de error al mostrar los productos
        console.error(error);
      }
    );
  }

  //Definimos el metodo para buscar los productos
  searchProducts(): void {
    if (this.searchName.trim() === '') { //En caso de que hagamos una busqueda vacia solicita que ingresemos un producto a buscar
      this.products = []; //No almacena nada en el array
      this.errorMessage = 'Por favor ingrese un nombre de producto válido.'; //Muestra el mensaje de error
      return;
    }

    this.productService.searchProductsByName(this.searchName).subscribe( //En caso valido llama al metodo del ProductService
      (data: any[]) => {
        this.products = data; // Asigna los productos encontrados al array definido
        this.errorMessage = ''; // Reinicia el mensaje de error
      },
      (error: any) => { //En caso de error 
        this.products = []; //No asigna ningun producto al array
        this.errorMessage = `Error al buscar productos con el nombre '${this.searchName}'.`; //Indica que el producto con ese nombre no existe
        console.error(error);
      }
    );
  }
  //Metodo para limpiar los campos al ocultas las funcionalidades
  toggleSearch(): void {
    //Indica a que datos hace referencia
    this.showSearch = !this.showSearch; //Es la bandera que demuestra si la funcionalidad esta ocullta o no
    this.searchName = ''; // Limpiar campo de búsqueda al ocultar
    this.products = []; // Limpiar productos al ocultar
    this.errorMessage = ''; // Limpiar mensaje de error al ocultar
  }

  //Metodo para cerrar sesion
  logout(): void {
    this.authService.logout(); //Llama al metodo Logout del AuthService
    window.location.href = '/login'; // Redirige al login
  }
}
