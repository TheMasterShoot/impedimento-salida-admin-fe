import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public url:string = "https://localhost:8080/api/Auth/";

    constructor(
      private http: HttpClient, 
      private jwtHelper: JwtHelperService, 
      private router: Router) {}

    login(usuario: any): Observable<any> {
      return this.http.post<any>(`${this.url}Login`, usuario);
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
