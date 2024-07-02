import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/login/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'login-box';
    public loginForm: UntypedFormGroup;
    public isAuthLoading = false;

    constructor(
        private renderer: Renderer2,
        private toastr: ToastrService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.loginForm = new UntypedFormGroup({
            username: new UntypedFormControl(null, Validators.required),
            password: new UntypedFormControl(null, Validators.required)
        });
    }

    loginByAuth() {
        if (this.loginForm.invalid) return;
        
        const objeto: any = {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password,
        }
        
        this.isAuthLoading = true;
        this.authService.login(objeto).subscribe({
            next:(data) => {
                if(data.isSuccess){
                    localStorage.setItem("token", data.token)
                    this.router.navigate([''])
                    this.toastr.success('Inicio de sesión satisfactorio')
                } else {
                    this.toastr.error('Credenciales incorrectas');
                    this.isAuthLoading = false;
                }
            },
            error:(error) => {
                console.log(error.message);
            }
        })
    }

    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
