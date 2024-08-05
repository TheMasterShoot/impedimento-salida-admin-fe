import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { LevantamientoSalidaService } from '@services/levantamiento/levantamiento-salida.service';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';

@Component({
    selector: 'app-levantamiento-rechazado-list',
    templateUrl: './levantamiento-rechazado-list.component.html',
    styleUrls: ['./levantamiento-rechazado-list.component.scss']
})
export class LevantamientoRechazadoListComponent implements OnInit, AfterViewInit {
    public solicitudes: any[] = [];
    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;
    dtOptions: Config = {};

    constructor(
        private levatamientoSalidaService: LevantamientoSalidaService
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
        this.levatamientoSalidaService.getSolicitudesLevantamiento().subscribe((data: any[]) => {
            const filtered = data.filter(data =>  data.estatusid === 4);
            this.solicitudes = filtered;
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


