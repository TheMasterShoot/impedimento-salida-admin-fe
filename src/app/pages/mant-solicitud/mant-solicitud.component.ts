import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RechazoComponent } from '@pages/modales/rechazo/rechazo.component';
import { LevantamientoSalidaService } from '@services/levantamiento/levantamiento-salida.service';
import { RechazoService } from '@services/rechazo/rechazo.service';
import { UsuarioService } from '@services/usuario/usuario.service';
import { compare } from 'fast-json-patch';
import { ToastrService } from 'ngx-toastr';
import { Observable, take } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mant-solicitud',
  templateUrl: './mant-solicitud.component.html',
  styleUrl: './mant-solicitud.component.scss'
})
export class MantSolicitudComponent implements OnInit {
  public imputado: any = {};
  public imputadoOriginal: any[] = [];
  public ciudadano: string = '';
  public tipoLevantamiento: string[] = ['Parcial', 'Definitivo'];
  public user;
  public motivoRechazo;
  public userSesion: any = [];
  public fechaHoy: Date = new Date();
  public fechaFormateada: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,  
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private rechazoService: RechazoService,
    private usuarioService: UsuarioService,
    private levatamientoSalidaService: LevantamientoSalidaService
  ) {
    this.fechaFormateada = this.datePipe.transform(this.fechaHoy, 'yyyy-MM-dd');
    this.userSesion = localStorage.getItem('user');
    this.usuarioService.getUsuarios().subscribe((data:any) => {
        const usuario = data.find((user) => user.username === this.userSesion)
        this.user = usuario
    }); 
   }
  
  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe((params) => {
      let id = params['id'];
      this.levatamientoSalidaService.getSolicitudLevantamientoById(id).subscribe(data => {
        if(data){
          this.imputado = Object.assign({}, data);
          this.imputadoOriginal = data;
          this.ciudadano = this.imputado.nombre + ' ' + this.imputado.apellido;
        }
      });
    });
    this.rechazoService.getRechazos().subscribe((data: any) => {
      const rechazoid = data.find((rechazo) => rechazo.levantamientoid === this.imputado.id);
      this.motivoRechazo = rechazoid;
      console.log('rechazo: ' + this.imputado.id)
    })
  }

  onDownload(archivo:string): void {
    if (archivo === 'carta') {
      var binaryData = [];
      binaryData.push(this.imputado.carta);
      const url = URL.createObjectURL(new Blob(binaryData, {type: "application/octet-stream"}));
      const link = document.createElement('a');
      link.href = url;
      link.download = this.imputado.carta; // Nombre del archivo para la descarga
      link.click();
      URL.revokeObjectURL(url); // Limpia el URL object después de su uso
    } else {
      console.error('No se ha cargado ningún archivo.');
    }
  }

  procesar(){
    Swal.fire({
      title: "¿Está seguro?",
      text: "No podras deshacer los cambios luego!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.imputado.estatusid = 2;
        const patch = compare(this.imputadoOriginal, this.imputado);
        this.levatamientoSalidaService.patchSolicitudLevantamiento(this.imputado.id, patch).subscribe(data =>{
            this.toastr.success('Solicitud procesada satisfactoriamente');
            // this.sendEmail();
            this.router.navigate(['/levantamientos-pendientes']).then(() => {
              window.history.replaceState({}, '', '/');
            });
        });
      }
    });
  }

  aprobar() {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Una vez aprobada no podrá modificarla!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Aprobar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.imputado.estatusid = 3;
        this.imputado.usuarioAprobacion = this.user.username;
        this.imputado.fechaAprobacion = this.fechaFormateada;
        const patch = compare(this.imputadoOriginal, this.imputado);
        this.levatamientoSalidaService.patchSolicitudLevantamiento(this.imputado.id, patch).subscribe(data =>{
            this.toastr.success('Solicitud aprobada satisfactoriamente');
            // this.sendEmail();
            this.router.navigate(['/levantamientos-en-proceso']).then(() => {
              window.history.replaceState({}, '', '/');
            });
        });
      }
    });

  }

  rechazar(obj: any){
     this.dialog.open(RechazoComponent, {
      disableClose: true,
      data: obj
    }).afterClosed().subscribe(result => {      
      if (result === "completado") {
        this.router.navigate(['/levantamientos-pendientes']).then(() => {
          window.history.replaceState({}, '', '/');
        });
      }
    });
  }

}
