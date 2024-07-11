import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import { AuthService } from '@services/login/auth.service';
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
    public user;
    public menu = MENU;

    constructor(
        public authService: AuthService,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        // this.user = this.authService.user;
        // console.log(this.user);
    }
}

export const MENU = [
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
