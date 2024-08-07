import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import { AuthService } from '@services/login/auth.service';
import { UsuarioService } from '@services/usuario/usuario.service';
import {Observable} from 'rxjs';

const BASE_CLASSES = 'main-sidebar elevation-4';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public user: any;
    public userSesion: any = [];
    public menu: any;
    public menuRol: number;

    constructor(
        public authService: AuthService,
        private usuarioService: UsuarioService,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        this.userSesion = localStorage.getItem('user');

        this.usuarioService.getUsuarios().subscribe((data:any) => {
            const usuario = data.find((user) => user.username === this.userSesion)
            this.user = usuario;
            this.menuRol = this.user.rolid;
            this.menu = this.menuRol === 2 ? MENUADM : MENU;
        });

    }
}


export const MENUADM = [
    {
        name: 'Inicio',
        iconClasses: 'fa-solid fa-house',
        path: ['/']
    },
    {
        name: 'Certificación IS',
        iconClasses: 'fa-solid fa-triangle-exclamation',
        children: [
            {
                name: 'Pendientes',
                iconClasses: 'fa-solid fa-clock',
                path: ['/certificaciones-pendientes']
            },
            // {
            //     name: 'En Proceso',
            //     iconClasses: 'fa-solid fa-spinner',
            //     path: ['/certificaciones-en-proceso']
            // },
            {
                name: 'Emitidas',
                iconClasses: 'fa-solid fa-check',
                path: ['/certificaciones-emitidas']
            }
        ]
    },
    {
        name: 'Desbloqueo de Salida',
        iconClasses: 'fa-solid fa-person-circle-minus',
        children: [
            {
                name: 'Pendientes',
                iconClasses: 'fa-solid fa-clock',
                path: ['/levantamientos-pendientes']
            },
            {
                name: 'En Proceso',
                iconClasses: 'fa-solid fa-spinner',
                path: ['/levantamientos-en-proceso']
            },
            {
                name: 'Emitidos',
                iconClasses: 'fa-solid fa-check',
                path: ['/levantamientos-emitidos']
            },
            {
                name: 'Rechazados',
                iconClasses: 'fa-solid fa-ban',
                path: ['/levantamientos-rechazados']
            }
        ]
    },
    {
        name: 'Configuración',
        iconClasses: 'fa-solid fa-gear',
        children: [
            {
                name: 'Usuarios',
                iconClasses: 'fa-solid fa-user',
                path: ['/usuarios']
            },
            {
                name: 'Roles',
                iconClasses: 'fa-solid fa-eye-low-vision',
                path: ['/roles']
            }
        ]
    }
]; 

export const MENU =

[
    {
        name: 'Inicio',
        iconClasses: 'fa-solid fa-house',
        path: ['/']
    },
    {
        name: 'Certificación IS',
        iconClasses: 'fa-solid fa-triangle-exclamation',
        children: [
            {
                name: 'Pendientes',
                iconClasses: 'fa-solid fa-clock',
                path: ['/certificaciones-pendientes']
            },
            // {
            //     name: 'En Proceso',
            //     iconClasses: 'fa-solid fa-spinner',
            //     path: ['/certificaciones-en-proceso']
            // },
            {
                name: 'Emitidas',
                iconClasses: 'fa-solid fa-check',
                path: ['/certificaciones-emitidas']
            }
        ]
    },
    {
        name: 'Desbloqueo de Salida',
        iconClasses: 'fa-solid fa-person-circle-minus',
        children: [
            {
                name: 'Pendientes',
                iconClasses: 'fa-solid fa-clock',
                path: ['/levantamientos-pendientes']
            },
            {
                name: 'En Proceso',
                iconClasses: 'fa-solid fa-spinner',
                path: ['/levantamientos-en-proceso']
            },
            {
                name: 'Emitidos',
                iconClasses: 'fa-solid fa-check',
                path: ['/levantamientos-emitidos']
            },
            {
                name: 'Rechazados',
                iconClasses: 'fa-solid fa-ban',
                path: ['/levantamientos-rechazados']
            }
        ]
    }
];
