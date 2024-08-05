import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RechazoService {

  url:string = "https://impsa.azurewebsites.net/api/"
  // url:string = "https://localhost:8080/api/"

  constructor(private http:HttpClient) { }

  getRechazos(): Observable<any[]> {
    let direccion = this.url + 'Rechazo';
    return this.http.get<any[]>(direccion);
  }

  getRechazoById(id: any): Observable<any> {
    let direccion = this.url + 'Rechazo/' + id;
    return this.http.get<any>(direccion);
  }

  addRechazo(id: any): Observable<any> {
    let direccion = this.url + 'Rechazo';
    return this.http.post<any>(direccion, id);
  }
  
  updateRechazo(id: any): Observable<any> {
    let direccion = this.url + 'Rechazo/' + id;
    return this.http.put<any>(direccion, id);
  }

  patchRechazo(id: number, operations: Operation[]){
    let direccion = this.url + 'Rechazo/' + id;
    return this.http.patch(direccion, operations);
  }
}
