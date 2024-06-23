import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RechazoService {

  url:string = "https://localhost:8080/api/"

  constructor(private http:HttpClient) { }

  addRechazo(id: any): Observable<any> {
    let direccion = this.url + 'Rechazo';
    return this.http.post<any>(direccion, id);
  }
  
  updateRechazo(id: any): Observable<any> {
    let direccion = this.url + 'Rechazo/' + id;
    return this.http.put<any>(direccion, id);
  }

}
