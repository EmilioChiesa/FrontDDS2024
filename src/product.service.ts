import { Injectable } from '@angular/core'; //Se importan los modulos necesarios para el funcionamiento
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//MServicio que define la logica de acceso a los datos de los productos y su gestion
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/products'; //Se define la url base a la que realizamos las peticiones

  //Inyectamos las funcionalidades de HttpClient
  constructor(private http: HttpClient) {}

  //Metodo para obtener los productos 
  getProducts(): Observable<any[]> {
    const headers = new HttpHeaders().set( //Settea el JWT que obtuvimos del login en el header de authorization
      'Authorization',
      `Bearer ${localStorage.getItem('accessToken')}` //De esta manera de valida nuestro usuario para poder realizar la peticion
    );
    return this.http.get<any[]>(`${this.baseUrl}/show`, { headers }); //Realiza la peticion GET para obtener los productos
  }
  //Metodo para buscar producto por nombre
  searchProductsByName(name: string): Observable<any[]> { //Recibe el nombre del producto que se desea buscar
    const headers = new HttpHeaders().set( //Hace lo mismo que en la funcion anteior
      'Authorization',
      `Bearer ${localStorage.getItem('accessToken')}`
    );
    return this.http.get<any[]>(`${this.baseUrl}/search/${name}`, { headers }); //Realiza un GET para obtener el producto especifico
  }
}
