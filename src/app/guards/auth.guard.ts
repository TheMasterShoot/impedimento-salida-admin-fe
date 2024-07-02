import {Injectable} from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import {Observable} from 'rxjs';
import { AuthService } from '@services/login/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.isAuthenticated()) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }

    // canActivate(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot
    // ):
    //     | Observable<boolean | UrlTree>
    //     | Promise<boolean | UrlTree>
    //     | boolean
    //     | UrlTree {
    //     return this.getProfile();
    // }

    // canActivateChild(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot
    // ):
    //     | Observable<boolean | UrlTree>
    //     | Promise<boolean | UrlTree>
    //     | boolean
    //     | UrlTree {
    //     return this.canActivate(next, state);
    // }

    // async getProfile() {
    //     if (this.authService.user) {
    //         return true;
    //     }

    //     try {
    //         await this.appService.getProfile();
    //         return true;
    //     } catch (error) {
    //         return false;
    //     }
    // }
}
