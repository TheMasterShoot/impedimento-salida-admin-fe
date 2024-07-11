import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  public url:string = "https://localhost:8080/api/";

  constructor(
    private http: HttpClient
  ) { }

  getRoles(): Observable<any[]> {
    let direccion = this.url + 'Roles';
    return this.http.get<any[]>(direccion);
  }
  
  getRolbyId(id: any): Observable<any> {
    let direccion = this.url + 'Roles/' + id;
    return this.http.get<any>(direccion);
  }
  
  updateRol(id: any): Observable<any> {
    let direccion = this.url + 'Roles/' + id;
    return this.http.put<any>(direccion, id);
  }
  
  addRol(rol: any): Observable<any> {
    let direccion = this.url + 'Roles';
    return this.http.post<any>(direccion, rol);
  }
}
