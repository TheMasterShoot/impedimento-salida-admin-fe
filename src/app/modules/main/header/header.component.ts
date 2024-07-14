import {AppState} from '@/store/state';
import {ToggleControlSidebar, ToggleSidebarMenu} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import { AuthService } from '@services/login/auth.service';
import { UsuarioService } from '@services/usuario/usuario.service';
import {Observable} from 'rxjs';

const BASE_CLASSES = 'main-header navbar navbar-expand';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public searchForm: UntypedFormGroup;
    public user;
    public userSesion: any = [];

    constructor(
        private authService: AuthService,
        private usuarioService: UsuarioService,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
        });
        this.searchForm = new UntypedFormGroup({
            search: new UntypedFormControl(null)
        });

        this.userSesion = localStorage.getItem('user');

        this.usuarioService.getUsuarios().subscribe((data:any) => {
            const usuario = data.find((user) => user.username === this.userSesion)
            this.user = usuario
        });
    }

    logout() {
        this.authService.logout();
    }

    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }

    onToggleControlSidebar() {
        this.store.dispatch(new ToggleControlSidebar());
    }
}
