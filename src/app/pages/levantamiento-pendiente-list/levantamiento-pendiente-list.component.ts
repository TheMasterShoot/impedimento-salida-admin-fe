import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { LevantamientoSalidaService } from '@services/levantamiento/levantamiento-salida.service';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';

@Component({
    selector: 'app-levantamiento-pendiente-list',
    templateUrl: './levantamiento-pendiente-list.component.html',
    styleUrls: ['./levantamiento-pendiente-list.component.scss']
})
export class LevantamientoPendienteListComponent implements OnInit, AfterViewInit {
    public solicitudes: any[] = [];
    @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;
    dtOptions: Config = {};
    estatusDesc: string = '';

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
            language: {
              url: '//cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json',
          },
        };
    }

    getSolicitudes(){
        this.levatamientoSalidaService.getSolicitudesLevantamiento().subscribe((data: any[]) => {
                const filtered = data.filter(data =>  data.estatusid === 1);
                this.solicitudes = filtered;
                this.setEstatusDesc(1);
        });
    }

    setEstatusDesc(value: number) {
        switch(value) {
    
          case 1:
            this.estatusDesc = 'Pendiente';
            break;
          case 2:
            this.estatusDesc = 'En Proceso';
            break;
          case 3:
            this.estatusDesc = 'Aprobado';
            break;
          case 4:
            this.estatusDesc = 'Rechazado';
            break;
        }
      }

    filterTable(){
        this.datatableElement.dtInstance.then((dtInstance:any) => {
            // Filtra por la columna 'estatus' para mostrar solo filas con estatus 'pendiente'
            const statusColumnIndex = 3; // Reemplaza con el índice correcto de la columna 'estatus'
            dtInstance.column(statusColumnIndex).search(1).draw(); // Aplica el filtro y redibuja la tabla
          });
          
    }
      
}


