import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CertificacionSalidaService } from '@services/certificacion/certificacion-salida.service';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';

@Component({
    selector: 'app-certificacion-existencia-procesando-list',
    templateUrl: './certificacion-existencia-procesando-list.component.html',
    styleUrls: ['./certificacion-existencia-procesando-list.component.scss']
})
export class CertificacionExistenciaProcesandoListComponent implements OnInit, AfterViewInit {
    public certificaciones: any[] = [];
    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;
    dtOptions: Config = {};

    constructor(
        private certificacionSalidaService: CertificacionSalidaService
    ) {}
    
    
    ngOnInit(): void {
        this.dataTableOption();
        this.getCertificaciones();      
    }

    ngAfterViewInit(): void {
        this.filterTable();
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

    getCertificaciones(){
        this.certificacionSalidaService.getCertificaciones().subscribe((data: any[]) => {
                const filtered = data.filter(data =>  data.estatusid === 2);
                this.certificaciones = filtered;
        });
    }

    filterTable(){
        this.datatableElement.dtInstance.then((dtInstance:any) => {
            // Filtra por la columna 'estatus' para mostrar solo filas con estatus 'pendiente'
            const statusColumnIndex = 3; // Reemplaza con el índice correcto de la columna 'estatus'
            dtInstance.column(statusColumnIndex).search(1).draw(); // Aplica el filtro y redibuja la tabla
          });
          
    }
      
}


