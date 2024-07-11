import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  
  updateUsuario(id: any): Observable<any> {
    let direccion = this.url + 'Usuarios/' + id;
    return this.http.put<any>(direccion, id);
  }
  
  addUsuario(usuario: any): Observable<any> {
    let direccion = this.url + 'SolicitudLevantamiento';
    return this.http.post<any>(direccion, usuario);
  }
}
