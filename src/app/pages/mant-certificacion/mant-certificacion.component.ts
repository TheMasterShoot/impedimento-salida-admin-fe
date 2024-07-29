import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificacionSalidaService } from '@services/certificacion/certificacion-salida.service';
import { EmailService } from '@services/email/email.service';
import { UsuarioService } from '@services/usuario/usuario.service';
import { compare } from 'fast-json-patch';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mant-certificacion',
  templateUrl: './mant-certificacion.component.html',
  styleUrl: './mant-certificacion.component.scss'
})
export class MantCertificacionComponent implements OnInit{
  public imputado: any = {};
  public imputadoOriginal: any[] = [];
  public ciudadano: string = '';
  public existeImpedimento: string[] = ['Si', 'No'];
  public user;
  public userSesion: any = [];
  public fechaHoy: Date = new Date();
  public fechaFormateada: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private emailService: EmailService,
    private usuarioService: UsuarioService,
    private certificacionService: CertificacionSalidaService
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
      this.certificacionService.getCertificacionById(id).subscribe(data => {
        if(data){
          this.imputado = Object.assign({}, data);
          this.imputadoOriginal = data;
          this.ciudadano = this.imputado.nombre + ' ' + this.imputado.apellido;
        }
      });
    });
  }

  aprobar(){
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
        this.certificacionService.patchCertificacion(this.imputado.id, patch).subscribe((data: any) => {
            this.toastr.success('Solicitud aprobada satisfactoriamente');
            this.sendEmail(this.imputado.email,this.imputado.nombre, this.imputado.apellido, this.imputado.fechaSolicitud, this.imputado.id);
            this.router.navigate(['/certificaciones-pendientes']).then(() => {
              window.history.replaceState({}, '', '/');
            });
        });
      }
    });
  }

  sendEmail(destino:string, nombre:string, apellido:string, fecSol:any, codigo:number){
    const email = {
      para: `${destino}`,
      asunto: 'Certificación de existencia de Impedimento de Salida Estatus de Solicitud',
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
            <p>Nos dirigimos a usted para informarle sobre el estatus de su solicitud presentada el ${this.datePipe.transform(fecSol, 'dd/MM/yyyy')} para Certificación de Existencia de Impedimento de Salida.</p>
            <div class="details">
                <p>Estatus de su Solicitud: <strong>Emitida</strong></p>
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
