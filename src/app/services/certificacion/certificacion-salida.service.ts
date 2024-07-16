import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificacionSalidaService {

  url:string = "https://localhost:8080/api/"

  constructor(private http:HttpClient) { }

  getCertificaciones(): Observable<any[]> {
    let direccion = this.url + 'CertificacionExistencia';
    return this.http.get<any[]>(direccion);
  }
  
  getCertificacionById(id: any): Observable<any> {
    let direccion = this.url + 'CertificacionExistencia/' + id;
    return this.http.get<any>(direccion);
  }

  updateCertificacion(certificacion: any): Observable<any> {
    let direccion = this.url + 'CertificacionExistencia/' + certificacion.id;
    return this.http.put<any>(direccion, certificacion);
  }

  patchCertificacion(certificacion: any, operations: Operation[]){
    let direccion = this.url + 'CertificacionExistencia/' + certificacion.id;
    return this.http.patch(direccion, operations);
  }

}
