import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {LoginComponent} from '@modules/login/login.component';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {AuthGuard} from '@guards/auth.guard';
import {NonAuthGuard} from '@guards/non-auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {SubMenuComponent} from '@pages/main-menu/sub-menu/sub-menu.component';
import { MantSolicitudComponent } from '@pages/mant-solicitud/mant-solicitud.component';
import { MantCertificacionComponent } from '@pages/mant-certificacion/mant-certificacion.component';
import { CertificacionExistenciaEmitidaListComponent } from '@pages/certificacion-existencia-emitida-list/certificacion-existencia-emitida-list.component';
import { CertificacionExistenciaProcesandoListComponent } from '@pages/certificacion-existencia-procesando-list/certificacion-existencia-procesando-list.component';
import { CertificacionExistenciaPendienteListComponent } from '@pages/certificacion-existencia-pendiente-list/certificacion-existencia-pendiente-list.component';
import { LevantamientoPendienteListComponent } from '@pages/levantamiento-pendiente-list/levantamiento-pendiente-list.component';
import { LevantamientoProcesandoListComponent } from '@pages/levantamiento-procesando-list/levantamiento-procesando-list.component';
import { LevantamientoRechazadoListComponent } from '@pages/levantamiento-rechazado-list/levantamiento-rechazado-list.component';
import { LevantamientoEmitidoListComponent } from '@pages/levantamiento-emitido-list/levantamiento-emitido-list.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'solicitud-levantamiento-impedimento/:id',
                component: MantSolicitudComponent,
                data: { breadcrumb: 'Detalle' }
            },
            {
                path: 'certificacion-existencia-impedimento/:id',
                component: MantCertificacionComponent,
                data: { breadcrumb: 'Detalle' } 
            },
            {
                path: 'certificaciones-pendientes',
                component: CertificacionExistenciaPendienteListComponent,
                data: { breadcrumb: 'Certificaciones Pendientes' }
            },
            {
                path: 'certificaciones-en-proceso',
                component: CertificacionExistenciaProcesandoListComponent,
                data: { breadcrumb: 'Certificaciones en Proceso' }
            },
            {
                path: 'certificaciones-emitidas',
                component: CertificacionExistenciaEmitidaListComponent,
                data: { breadcrumb: 'Certificaciones Emitidas' }
            },
            {
                path: 'levantamientos-pendientes',
                component: LevantamientoPendienteListComponent,
                data: { breadcrumb: 'Levantamientos de Impedimento Pendientes' }
            },
            {
                path: 'levantamientos-en-proceso',
                component: LevantamientoProcesandoListComponent,
                data: { breadcrumb: 'Levantamientos de Impedimento en Proceso' }
            },
            {
                path: 'levantamientos-emitidos',
                component: LevantamientoEmitidoListComponent,
                data: { breadcrumb: 'Levantamientos de Impedimento Emitidos' }
            },
            {
                path: 'levantamientos-rechazados',
                component: LevantamientoRechazadoListComponent,
                data: { breadcrumb: 'Levantamientos de Impedimento Rechazados' }
            },
            {
                path: '',
                component: DashboardComponent,
                data: { breadcrumb: 'Inicio' }
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
