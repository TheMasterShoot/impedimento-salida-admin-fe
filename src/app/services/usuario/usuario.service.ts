import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@pages/modales/mant-usuario/mant-usuario.component';
import { Operation } from 'fast-json-patch';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url:string = environment.url
  // public url:string = "https://impsa.azurewebsites.net/api/";
  // url:string = "https://localhost:8080/api/"

  constructor(
    private http: HttpClient
  ) { }

  
  getUsuarios(): Observable<any[]> {
    let direccion = this.url + 'Usuarios';
    return this.http.get<any[]>(direccion);
  }
  
  getUsarioById(id: any): Observable<any> {
    let direccion = this.url + 'Usuarios/' + id;
    return this.http.get<any>(direccion);
  }
  
  updateUsuario(user: User): Observable<any> {
    let direccion = this.url + 'Usuarios/' + user.id;
    return this.http.put<any>(direccion, user);
  }
  
  addUsuario(usuario: any): Observable<any> {
    let direccion = this.url + 'Usuarios';
    return this.http.post<any>(direccion, usuario);
  }

  patchUsuario(id: number, operations: Operation[]){
    let direccion = this.url + 'Usuarios/' + id;
    return this.http.patch(direccion, operations);
  }
}
