import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { catchError, map, of} from 'rxjs';
import { AuthService } from '@services/login/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
    // debugger;
    const token = localStorage.getItem("token") || "";
    const router = inject(Router);

    const authService = inject(AuthService)
    if(token != ""){
         return authService.validarToken(token).pipe(
              map(data => {
                   if(data.isSuccess){
                        return true
                   } else{
                        router.navigate(['login'])
                        return false;
                   }
              }),
              catchError(error => {
                   router.navigate(['login'])
                        return of(false);
              })
         )
    }else {
         // router.navigateByUrl("");
         // return false
         const url = router.createUrlTree(["login"])
         return url;
    }
 
};