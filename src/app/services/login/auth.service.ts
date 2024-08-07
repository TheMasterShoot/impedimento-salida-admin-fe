import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public url:string = environment.url
    // public url:string = "https://impsa.azurewebsites.net/api/";
    // url:string = "https://localhost:8080/api/"

    constructor(
      private http: HttpClient, 
      private jwtHelper: JwtHelperService, 
      private router: Router) {}

    login(usuario: any): Observable<any> {
      return this.http.post<any>(`${this.url}Auth/Login`, usuario);
    }

    validarToken(token: string): Observable<any> {
      return this.http.get<any>(`${this.url}Auth/ValidarToken?token=${token}`);
    }
  
    isAuthenticated(): boolean {
      const token = localStorage.getItem('token');
      return token && !this.jwtHelper.isTokenExpired(token);
    }
  
    logout() {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
