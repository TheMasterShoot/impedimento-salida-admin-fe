import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MantUsuarioComponent } from '@pages/modales/mant-usuario/mant-usuario.component';
import { UsuarioService } from '@services/usuario/usuario.service';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';

@Component({
    selector: 'app-usuarios-list',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, AfterViewInit {
    public usuarios: any = {};
    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;
    dtOptions: Config = {};

    constructor(
      private dialog: MatDialog,
        private usuarioService: UsuarioService
    ) {}
    
    
    ngOnInit(): void {
        this.dataTableOption();
        this.getUsuarios();      
    }

    ngAfterViewInit() {
               
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

    getUsuarios(){
        this.usuarioService.getUsuarios().subscribe((data: any) => {
          this.usuarios = data;
        });
    }

    agregarUsuario() {
      this.dialog.open(MantUsuarioComponent, {
          disableClose: true
        }).afterClosed().subscribe(result => {
          
          if (result === "agregado") {
            this.getUsuarios();
          }
        });
    }
  
    editarUsuario(usuario: any) {
      this.dialog.open(MantUsuarioComponent, {
        disableClose: true,
        data: usuario
      }).afterClosed().subscribe(result => {
        
        if (result === "editado")
          this.getUsuarios();
  
      });
    }
      
}


