import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MantRolesComponent } from '@pages/modales/mant-roles/mant-roles.component';
import { RolService } from '@services/rol/rol.service';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, AfterViewInit {
    public roles: any = {};
    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;
    dtOptions: Config = {};

    constructor(
        private dialog: MatDialog,
        private rolService: RolService
    ) {}
    
    
    ngOnInit(): void {
        this.dataTableOption();
        this.getRoles();      
    }

    ngAfterViewInit(): void {
    }

    dataTableOption(){
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            processing: true,
            language: {
              url: '//cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json',
          },
        };
    }

    getRoles(){
        this.rolService.getRoles().subscribe((data: any) => {
            this.roles = data;
        });
    }

    agregarRol() {
        this.dialog.open(MantRolesComponent, {
            disableClose: true
          }).afterClosed().subscribe(result => {
            
            if (result === "agregado") {
              this.getRoles();
            }
          });
      }

    editarRol(rol: any){
        this.dialog.open(MantRolesComponent, {
            disableClose: true,
            data: rol
          }).afterClosed().subscribe(result => {
            
            if (result === "editado")
              this.getRoles();
      
          });
    }
      
}


