import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { sleep } from '@/utils/helpers';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public url:string = "https://localhost:8080/api/Auth/";
    private currentUserKey = 'currentUser';

    constructor(
      private http: HttpClient, 
      private jwtHelper: JwtHelperService, 
      private router: Router, 
      private toastr: ToastrService) {}

    login(usuario: any): Observable<any> {
      return this.http.post<any>(`${this.url}Login`, usuario);
    }

    getCurrentUser() {
      // Recuperando la información del usuario desde el localStorage.
      const user = localStorage.getItem(this.currentUserKey);
      return user ? JSON.parse(user) : null;
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
