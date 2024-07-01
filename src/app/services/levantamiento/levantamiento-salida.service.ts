import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevantamientoSalidaService {

  url:string = "https://localhost:8080/api/"

  constructor(private http:HttpClient) { }

  getSolicitudesLevantamiento(): Observable<any[]> {
    let direccion = this.url + 'SolicitudLevantamiento';
    return this.http.get<any[]>(direccion);
  }
  
  getSolicitudLevantamientoById(id: any): Observable<any> {
    let direccion = this.url + 'SolicitudLevantamiento/' + id;
    return this.http.get<any>(direccion);
  }

  updateSolicitudLevantamiento(id: any): Observable<any> {
    let direccion = this.url + 'SolicitudLevantamiento/' + id;
    return this.http.put<any>(direccion, id);
  }

  patchSolicitudLevantamiento(id: any, operations: Operation[]){
    let direccion = this.url + 'SolicitudLevantamiento/' + id;
    return this.http.patch(direccion, operations);
  }

}
