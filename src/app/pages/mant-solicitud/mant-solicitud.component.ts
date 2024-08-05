import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RechazoComponent } from '@pages/modales/rechazo/rechazo.component';
import { EmailService } from '@services/email/email.service';
import { LevantamientoSalidaService } from '@services/levantamiento/levantamiento-salida.service';
import { RechazoService } from '@services/rechazo/rechazo.service';
import { UsuarioService } from '@services/usuario/usuario.service';
import { compare } from 'fast-json-patch';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { saveAs } from 'file-saver';
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
  public lastSlashIndex: any;
  public fileName: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,  
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private emailService: EmailService,
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
    })
  }

  onDownload(file: string) {
    switch (file) {
      case 'carta':
        this.lastSlashIndex = this.imputado.carta.lastIndexOf("/");
        this.fileName = this.imputado.carta.substring(this.lastSlashIndex + 1);
        break;
      case 'sentencia':
        this.lastSlashIndex = this.imputado.sentencia.lastIndexOf("/");
        this.fileName = this.imputado.sentencia.substring(this.lastSlashIndex + 1);
        break;
      case 'noRecurso':
        this.lastSlashIndex = this.imputado.noRecurso.lastIndexOf("/");
        this.fileName = this.imputado.noRecurso.substring(this.lastSlashIndex + 1);
        break;
    }

    this.levatamientoSalidaService.downloadFile(this.imputado.cedula, this.fileName).subscribe(
      (blob) => {
        saveAs(blob, this.fileName);
      },
      (error) => {
        console.error('Error al descargar el archivo', error);
      }
    );
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
            this.sendEmail(this.imputado.email,this.imputado.nombre, this.imputado.apellido, this.imputado.fechaSolicitud, this.imputado.id, this.imputado.estatusid);
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
            this.sendEmail(this.imputado.email,this.imputado.nombre, this.imputado.apellido, this.imputado.fechaSolicitud, this.imputado.id, this.imputado.estatusid);
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

  sendEmail(destino:string, nombre:string, apellido:string, fecSol:any, codigo:number, estatusid:number){
    let estatus = estatusid == 2 ? 'En Proceso' : 'Aprobado';
    const email = {
      para: `${destino}`,
      asunto: 'Levantamiento de Impedimento de Salida Estatus de Solicitud',
      cuerpo:`
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        .encabezado {
            font-size: 10px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header, .footer {
            text-align: left;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            margin-bottom: 20px;
        }
        .details {
            margin-top: 20px;
        }
    </style>
</head>
<body>
        <div class="header">
            <h1>Procuraduría General de la República</h1>
            <p class="encabezado">Ave. Jiménez Moya esq. Juan Ventura Simó, Centro de los Héroes, Santo Domingo, República Dominicana.</p>
            <p class="encabezado">Tel.: 809-533-3522 ext. 133, 2002, 1125</p>
            <p class="encabezado">Email: mesadeayuda@pgr.gob.do</p>
        </div>
        <hr>
        <br>
        <div class="content">
            <p><strong>Estimado/a ${nombre + ' ' + apellido}:</strong></p>
            <p>Nos dirigimos a usted para informarle sobre el estatus de su solicitud presentada el ${this.datePipe.transform(fecSol, 'dd/MM/yyyy')} para Levantamiento de Impedimento de Salida.</p>
            <div class="details">
                <p>Estatus de su Solicitud: <strong>${estatus}</strong></p>
                <p><strong>Detalles:</strong></p>
                <ul>
                    <li>Número de Solicitud:<strong>${codigo}</strong></li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>Para más información, no dude en contactarnos a través de los medios mencionados arriba.</p>
        </div>
</body>
      
      `
    }
    
    this.emailService.sendEmail(email).subscribe();

  }

}
