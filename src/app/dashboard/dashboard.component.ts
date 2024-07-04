// Se importan los módulos necesarios para el correcto funcionamiento
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth.service';
import { ProductService } from 'src/product.service';

// Se definen todos los datos del componente
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
// Definimos los diferentes atributos que necesitamos en la realización de las funcionalidades
export class DashboardComponent implements OnInit {
  products: any[] = []; // Definimos el array en el que se almacenan los objetos
  errorMessage: string = '';
  searchName: string = '';
  showSearch: boolean = false;
  showProducts: boolean = false; // Nueva propiedad para alternar visibilidad de productos
  isLoggedIn: boolean = false;
  
  // Inyectamos los servicios de AuthService y ProductService
  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) { }

  // Definimos el método para saber si estamos logueados o no
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  // Definimos el método para obtener los productos
  fetchProducts(): void {
    if (this.showProducts) {
      this.showProducts = false; // Oculta los productos si ya se están mostrando
      this.products = [];
    } else {
      this.productService.getProducts().subscribe( // Llamamos el método getProducts de ProductService
        (data: any[]) => { // Recibe la lista de productos
          this.products = data; // Las guarda en el array definido arriba
          this.errorMessage = '';
          this.showProducts = true; // Muestra los productos al obtenerlos
          this.showSearch = false; // Oculta la búsqueda si se muestran los productos
          this.searchName = ''; // Limpiar campo de búsqueda al cambiar a Ver Productos
        },
        (error: any) => { // En caso de haber error al realizar la solicitud
          this.errorMessage = 'Error fetching products'; // Enviamos un mensaje de error al mostrar los productos
          console.error(error);
        }
      );
    }
  }

  // Definimos el método para buscar los productos
  searchProducts(): void {
    if (this.searchName.trim() === '') { // En caso de que hagamos una búsqueda vacía solicita que ingresemos un producto a buscar
      this.products = []; // No almacena nada en el array
      this.errorMessage = 'Por favor ingrese un nombre de producto válido.'; // Muestra el mensaje de error
      return;
    }

    this.productService.searchProductsByName(this.searchName).subscribe( // En caso válido llama al método del ProductService
      (data: any[]) => {
        this.products = data; // Asigna los productos encontrados al array definido
        this.errorMessage = ''; // Reinicia el mensaje de error
        this.showProducts = true; // Muestra los productos buscados
        this.showSearch = false; // Oculta la búsqueda al mostrar resultados
      },
      (error: any) => { // En caso de error
        this.products = []; // No asigna ningún producto al array
        this.errorMessage = `Error al buscar productos con el nombre '${this.searchName}'.`; // Indica que el producto con ese nombre no existe
        console.error(error);
      }
    );
  }

  // Método para limpiar los campos al ocultar las funcionalidades
  toggleSearch(): void {
    // Indica a qué datos hace referencia
    if (this.showSearch) {
      this.showSearch = false; // Es la bandera que demuestra si la funcionalidad está oculta o no
      this.searchName = ''; // Limpiar campo de búsqueda al ocultar
      this.products = []; // Limpiar productos al ocultar
      this.errorMessage = ''; // Limpiar mensaje de error al ocultar
    } else {
      this.showSearch = true; // Mostrar búsqueda
      this.showProducts = false; // Ocultar productos
      this.products = []; // Limpiar productos al cambiar a Buscar Productos
      this.errorMessage = ''; // Limpiar mensaje de error al cambiar a Buscar Productos
    }
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout(); // Llama al método Logout del AuthService
    window.location.href = '/login'; // Redirige al login
  }
}
