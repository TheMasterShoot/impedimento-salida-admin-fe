import { _supportsShadowDom } from '@angular/cdk/platform';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EmailService } from '@services/email/email.service';
import { LevantamientoSalidaService } from '@services/levantamiento/levantamiento-salida.service';
import { RechazoService } from '@services/rechazo/rechazo.service';
import { UsuarioService } from '@services/usuario/usuario.service';
import { compare } from 'fast-json-patch';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rechazo',
  templateUrl: './rechazo.component.html',
  styleUrl: './rechazo.component.scss'
})
export class RechazoComponent implements OnInit {
  formRechazo: FormGroup;
  hide: boolean = true;
  title: string ="Rechazo"
  accionBoton: string = "Aceptar";
  public user;
  public userSesion: any = [];
  public fechaHoy: Date = new Date();
  public fechaFormateada: any;
  public imputado1: any = {};
  public imputadoOriginal: any[] = [];
  public rechazoExist;

  constructor(
    @Inject(MAT_DIALOG_DATA) public imputado: any,
    private dialogoReferencia: MatDialogRef<RechazoComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private emailService: EmailService,
    private usuarioService: UsuarioService,
    private rechazoService: RechazoService,
    private levantamientoSalidaService: LevantamientoSalidaService
  ) {
    this.fechaFormateada = this.datePipe.transform(this.fechaHoy, 'yyyy-MM-dd'); 
    this.formRechazo = this.fb.group({
    motivo: ['', Validators.required],
  });

}
  
  ngOnInit(): void {
    this.userSesion = localStorage.getItem('user');
    this.usuarioService.getUsuarios().subscribe((data:any) => {
        const usuario = data.find((user) => user.username === this.userSesion)
        this.user = usuario
    });
    this.levantamientoSalidaService.getSolicitudLevantamientoById(this.imputado.id).subscribe(data => {
      if(data){
        this.imputadoOriginal = data;
      }
    });
    this.rechazoService.getRechazos().subscribe((data: any) => {
      const levantamientoId = data.find( r => r.levantamientoid === this.imputado.id);
      this.rechazoExist = levantamientoId;
    })
  }

  rechazar(){
    if(this.imputado.estatusid === 1){
      this.imputado.estatusid = 5;
      this.setLevantamiento();
    } else {
      this.imputado.estatusid = 4;
      this.imputado.usuarioAprobacion = this.user.username;
      this.imputado.fechaAprobacion = this.fechaFormateada;
      this.setLevantamiento();
    }
  }

  setLevantamiento(){
    const patch = compare(this.imputadoOriginal, this.imputado);
    this.levantamientoSalidaService.patchSolicitudLevantamiento(this.imputado.id, patch).subscribe((data: any) => {
      this.setRechazo();
    });

  }

  setRechazo(){    
    const _rechazo: any = {
      id: this.rechazoExist == null ? 0 : this.rechazoExist.id,
      levantamientoid: this.imputado.id,
      motivo: this.formRechazo.value.motivo,
    }

    if(this.rechazoExist) {
      const patch = compare(this.rechazoExist, _rechazo);
      this.rechazoService.patchRechazo(_rechazo.id, patch).subscribe((data: any) => {
        this.toastr.success("Solicitud rechazada satisfactoriamente");
        console.log('consol: ' + JSON.stringify(data))
        this.sendEmail(data.levantamientoid, data.motivo);
        this.dialogoReferencia.close('completado');
      });
    } else {
      this.rechazoService.addRechazo(_rechazo).subscribe((data: any) => {
        this.toastr.success("Solicitud rechazada satisfactoriamente");
        this.sendEmail(data.levantamientoid, data.motivo);
        this.dialogoReferencia.close('completado');
      });
    }

  }

  sendEmail( codigo:number, motivo:string){
    let estatus = 'Rechazada';
    const email = {
      para: `${this.imputado.email}`,
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
            <p><strong>Estimado/a ${this.imputado.nombre + ' ' + this.imputado.apellido}:</strong></p>
            <p>Nos dirigimos a usted para informarle sobre el estatus de su solicitud presentada el ${this.datePipe.transform(this.imputado.fechaSolicitud, 'dd/MM/yyyy')} para Levantamiento de Impedimento de Salida.</p>
            <div class="details">
                <p>Estatus de su Solicitud: <strong>${estatus}</strong></p>
                <p><strong>Detalles:</strong></p>
                <ul>
                    <li>Motivo de Rechazo: <strong>${motivo}</strong></li>
                    <li>Número de Solicitud: <strong>${codigo}</strong></li>
                </ul>
            </div>
            ${this.imputado.estatusid === 5 ? 
              `<p><strong>Pasos para actualizar sus documentos adjuntados:</strong></p>
                <ul>
                    <li>Ingresar en el portal de servicios de la Procuraduría General de la República, a través del siguiente enlace <a href="https://impsapgr.azurewebsites.net">https://impsapgr.azurewebsites.net/</a>.</li>
                    <li>Click la opción "consultar servicios en línea"</li>
                    <li>Click en consultar en la opción "Levantamiento de impedimento de salida"</li>
                    <li>Click en editar en la solicitud con estatus "Rechazada Temporal"</li>
                    <li>Llene todos los campos del formulario"</li>
                    <li>Click en Enviar</li>
                </ul>
              ` : ''}
        </div>
        <div class="footer">
            <p>Para más información, no dude en contactarnos a través de los medios mencionados arriba.</p>
        </div>
</body>
      
      `
    }
    
    const formData = new FormData();
    formData.append('Para', email.para);
    formData.append('Asunto', email.asunto);
    formData.append('Cuerpo', email.cuerpo);

    this.emailService.sendEmail(formData).subscribe();

  }
}  

