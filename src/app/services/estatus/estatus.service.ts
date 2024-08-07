import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstatusService {

  url:string = environment.url
  // public url:string = "https://impsa.azurewebsites.net/api/";
  // url:string = "https://localhost:8080/api/"

  constructor(
    private http: HttpClient
  ) { }

  getEstatuses(): Observable<any[]> {
    let direccion = this.url + 'Estatus';
    return this.http.get<any[]>(direccion);
  }
  
  getEstatusbyId(id: any): Observable<any> {
    let direccion = this.url + 'Estatus/' + id;
    return this.http.get<any>(direccion);
  }
  
  updateEstatus(id: any): Observable<any> {
    let direccion = this.url + 'Estatus/' + id;
    return this.http.put<any>(direccion, id);
  }
  
  addEstatus(estatus: any): Observable<any> {
    let direccion = this.url + 'Estatus';
    return this.http.post<any>(direccion, estatus);
  }
}
