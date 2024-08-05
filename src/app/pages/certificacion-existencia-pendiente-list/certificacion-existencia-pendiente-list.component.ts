import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CertificacionSalidaService } from '@services/certificacion/certificacion-salida.service';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';

@Component({
    selector: 'app-certificacion-existencia-pendiente-list',
    templateUrl: './certificacion-existencia-pendiente-list.component.html',
    styleUrls: ['./certificacion-existencia-pendiente-list.component.scss']
})
export class CertificacionExistenciaPendienteListComponent implements OnInit, AfterViewInit {
    public certificaciones: any[] = [];
    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;
    dtOptions: Config = {};

    constructor(
        private certificacionSalidaService: CertificacionSalidaService
    ) {}
    
    
    ngOnInit(): void {
        this.dataTableOption();
        this.getSolicitudes();      
    }

    ngAfterViewInit(): void {
        this.filterTable();
    }

    dataTableOption(){
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            processing: true,
            order: [[0, 'desc']],
            language: {
              url: '//cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json',
          },
        };
    }

    getSolicitudes(){
        this.certificacionSalidaService.getCertificaciones().subscribe((data: any[]) => {
                const filtered = data.filter(data =>  data.estatusid === 1);
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


