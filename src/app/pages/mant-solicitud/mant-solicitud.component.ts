import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LevantamientoSalidaService } from '@services/levantamiento/levantamiento-salida.service';
import { RechazoService } from '@services/rechazo/rechazo.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-mant-solicitud',
  templateUrl: './mant-solicitud.component.html',
  styleUrl: './mant-solicitud.component.scss'
})
export class MantSolicitudComponent implements OnInit {
  public imputado:any
  public estatusDesc: string = '';
  public ciudadano: string = '';

  constructor(
    private route:ActivatedRoute,
    private levatamientoSalidaService: LevantamientoSalidaService,
    private rechazoService: RechazoService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe((params) => {
      let id = params['id'];
      this.levatamientoSalidaService.getSolicitudLevantamientoById(id).subscribe(data => {
        if(data){
          this.imputado = data;
          this.ciudadano = this.imputado.nombre + ' ' + this.imputado.apellido;
          this.setEstatusDesc(this.imputado.estatusid);
        }
      });
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

  onDownload(archivo:string): void {
    console.log(this.imputado.rechazo)
    if (archivo === 'carta') {
      const url = URL.createObjectURL(this.imputado.carta);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.imputado.carta.name; // Nombre del archivo para la descarga
      link.click();
      URL.revokeObjectURL(url); // Limpia el URL object después de su uso
    } else {
      console.error('No se ha cargado ningún archivo.');
    }
  }

  procesar(){

  }

  aprobar() {

  }

  rechazar(){
    // if(this.imputado.estatusid === 1){

    // } else {

    // }
  }

}
