import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';

import {AppRoutingModule} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from '@modules/main/main.component';
import {LoginComponent} from '@modules/login/login.component';
import {HeaderComponent} from '@modules/main/header/header.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {ToastrModule} from 'ngx-toastr';
import {MessagesComponent} from '@modules/main/header/messages/messages.component';
import {NotificationsComponent} from '@modules/main/header/notifications/notifications.component';

import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import {UserComponent} from '@modules/main/header/user/user.component';
import {LanguageComponent} from '@modules/main/header/language/language.component';
import {MainMenuComponent} from './pages/main-menu/main-menu.component';
import {SubMenuComponent} from './pages/main-menu/sub-menu/sub-menu.component';
import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {ControlSidebarComponent} from './modules/main/control-sidebar/control-sidebar.component';
import {StoreModule} from '@ngrx/store';
import {authReducer} from './store/auth/reducer';
import {uiReducer} from './store/ui/reducer';
import {ProfabricComponentsModule} from '@profabric/angular-components';
import {SidebarSearchComponent} from './components/sidebar-search/sidebar-search.component';
import {NgxGoogleAnalyticsModule} from 'ngx-google-analytics';
import { environment } from 'environments/environment';
import { DataTablesModule } from 'angular-datatables';
import { CertificacionExistenciaEmitidaListComponent } from '@pages/certificacion-existencia-emitida-list/certificacion-existencia-emitida-list.component';
import { CertificacionExistenciaPendienteListComponent } from '@pages/certificacion-existencia-pendiente-list/certificacion-existencia-pendiente-list.component';
import { CertificacionExistenciaProcesandoListComponent } from '@pages/certificacion-existencia-procesando-list/certificacion-existencia-procesando-list.component';
import { LevantamientoRechazadoListComponent } from '@pages/levantamiento-rechazado-list/levantamiento-rechazado-list.component';
import { LevantamientoEmitidoListComponent } from '@pages/levantamiento-emitido-list/levantamiento-emitido-list.component';
import { LevantamientoPendienteListComponent } from '@pages/levantamiento-pendiente-list/levantamiento-pendiente-list.component';
import { LevantamientoProcesandoListComponent } from '@pages/levantamiento-procesando-list/levantamiento-procesando-list.component';
import { MantSolicitudComponent } from '@pages/mant-solicitud/mant-solicitud.component';
import { BreadcrumbsComponent } from '@components/breadcrumbs/breadcrumbs.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from '@services/login/auth.service';
import { authInterceptor } from './custom/auth.interceptor';
import { UsuariosComponent } from '@pages/usuarios/usuarios.component';
import { MantUsuarioComponent } from '@pages/modales/mant-usuario/mant-usuario.component';
import { RolesComponent } from '@pages/roles/roles.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MantRolesComponent } from '@pages/modales/mant-roles/mant-roles.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { RechazoComponent } from '@pages/modales/rechazo/rechazo.component';





registerLocaleData(localeEn, 'en-EN');

export function tokenGetter() {
    return localStorage.getItem('token');
  }

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        MenuSidebarComponent,
        CertificacionExistenciaEmitidaListComponent,
        CertificacionExistenciaPendienteListComponent,
        CertificacionExistenciaProcesandoListComponent,
        LevantamientoEmitidoListComponent,
        LevantamientoPendienteListComponent,
        LevantamientoProcesandoListComponent,
        LevantamientoRechazadoListComponent,
        MantSolicitudComponent,
        DashboardComponent,
        UsuariosComponent,
        MantUsuarioComponent,
        MantRolesComponent,
        RolesComponent,
        RechazoComponent,
        MessagesComponent,
        NotificationsComponent,
        UserComponent,
        LanguageComponent,
        MainMenuComponent,
        SubMenuComponent,
        MenuItemComponent,
        BreadcrumbsComponent,
        ControlSidebarComponent,
        SidebarSearchComponent
    ],
    imports: [
        ProfabricComponentsModule,
        DataTablesModule,
        CommonModule,
        BrowserModule,
        StoreModule.forRoot({auth: authReducer, ui: uiReducer}),
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule,
        MatGridListModule,
        MatTooltipModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        HttpClientModule,
        JwtModule.forRoot({
          config: {
            tokenGetter,
            allowedDomains: ['localhost:5000'],
            disallowedRoutes: []
          }
        }),
        NgxGoogleAnalyticsModule.forRoot(environment.GA_ID)
    ],
    providers: [
      AuthService,
      DatePipe,
      provideHttpClient(withInterceptors([authInterceptor])),
      provideAnimationsAsync()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
