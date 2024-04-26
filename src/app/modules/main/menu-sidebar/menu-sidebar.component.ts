import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
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
        public appService: AppService,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        this.user = this.appService.user;
        console.log(this.user);
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
                path: ['/sub-menu-1']
            },
            {
                name: 'En Proceso',
                iconClasses: 'fa-solid fa-spinner',
                path: ['/sub-menu-2']
            },
            {
                name: 'Emitidas',
                iconClasses: 'fa-solid fa-check',
                path: ['/sub-menu-2']
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
                path: ['/sub-menu-1']
            },
            {
                name: 'En Proceso',
                iconClasses: 'fa-solid fa-spinner',
                path: ['/sub-menu-2']
            },
            {
                name: 'Emitidos',
                iconClasses: 'fa-solid fa-check',
                path: ['/sub-menu-2']
            },
            {
                name: 'Rechazados',
                iconClasses: 'fa-solid fa-ban',
                path: ['/sub-menu-2']
            }
        ]
    }
];
