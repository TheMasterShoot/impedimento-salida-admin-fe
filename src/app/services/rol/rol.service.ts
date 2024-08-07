import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  url:string = environment.url
  // public url:string = "https://impsa.azurewebsites.net/api/";
  // url:string = "https://localhost:8080/api/"

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
  
  updateRol(rol: any): Observable<any> {
    let direccion = this.url + 'Roles/' + rol.id;
    return this.http.put<any>(direccion, rol);
  }
  
  addRol(rol: any): Observable<any> {
    let direccion = this.url + 'Roles';
    return this.http.post<any>(direccion, rol);
  }
}
