import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@pages/modales/mant-usuario/mant-usuario.component';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public url:string = "https://localhost:8080/api/";

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
}
