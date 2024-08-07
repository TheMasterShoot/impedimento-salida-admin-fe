import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificacionSalidaService } from '@services/certificacion/certificacion-salida.service';
import { EmailService } from '@services/email/email.service';
import { UsuarioService } from '@services/usuario/usuario.service';
import { compare } from 'fast-json-patch';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mant-certificacion',
  templateUrl: './mant-certificacion.component.html',
  styleUrl: './mant-certificacion.component.scss'
})
export class MantCertificacionComponent implements OnInit{
  pdfBlob: Blob | null = null;
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
            this.generatePdf(this.imputado.nombre, this.imputado.apellido, this.imputado.cedula, this.imputado.existeImpedimento, this.imputado.motivo, this.imputado.referencia)
            this.toastr.success('Solicitud aprobada satisfactoriamente');
            this.sendEmail(this.imputado.email,this.imputado.nombre, this.imputado.apellido, this.imputado.fechaSolicitud, this.imputado.id);
            this.router.navigate(['/certificaciones-pendientes']).then(() => {
              window.history.replaceState({}, '', '/');
            });
        });
      }
    });
  }

  generatePdf(nombre?:any, apellido?:any, cedula?: any, existImpedimento?:any, motivo?:any, referencia?:any): Promise<Blob> {
    const fechaStr = this.imputado.fechaAprobacion;
    const fecha = new Date(fechaStr);
    
    // Crear un formateador para la fecha
    const opciones: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const formateador: Intl.DateTimeFormat = new Intl.DateTimeFormat('es-ES', opciones);
    
    // Formatear la fecha
    const fechaFormateada = formateador.format(fecha);
    
    return new Promise((resolve, reject) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      const options = {
        background: 'white',
        scale: 3
      };
  
      // Aquí puedes definir tu HTML como un string
      const htmlContent = `
        <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificación de Existencia de Impedimento de Salida</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        .container {
            max-width: 700px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h3 {
            margin-top: 30;
            line-height: 0 !important;
        }
        h1 {
            margin-top : 55px;
            text-align: center;
        }
        .content {
            margin-bottom: 20px;
        }
        .details {
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
        }
        .ltext {
            text-align: justify;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h3>REPÚBLICA DOMINICANA</h3>
            <h4>PROCURADURÍA GENERAL DE LA REPÚBLICA</h4>
        </div>
        <div class="content">
            <h1>CERTIFICACIÓN</h1>
            <p class="ltext">
                Certificamos que en el sistema de información del Ministerio Público <strong> ${this.imputado.existeImpedimento == 'No' ?`NO` : ''} EXISTE IMPEDIMENTO DE SALIDA</strong> 
                para <strong>${this.imputado.nombre + ' ' + this.imputado.apellido}</strong> con Cédula de Identidad y Electoral número <strong>${this.imputado.cedula}</strong>. Por lo tanto, se expide la presente certificación.
            </p>
            ${this.imputado.existeImpedimento == 'Si' ? 
              `<p>
                Impedimento existente:
            </p>
            <div class="details">
                <ul>
                    <li><strong>Motivo: </strong> ${this.imputado.motivo}</li>
                    <li><strong>Referencia: </strong> ${this.imputado.referencia}</li>
                </ul>
            </div>
            `
              : ''}
            
        </div>
        <div class="footer">
            <p class="ltext">
                La presente certificación se expide, firma, y sella digitalmente a solicitud de la parte interesada, El día ${fechaFormateada} .
            </p>
        </div>
    </div>
</body>
</html>

      `;
  
      // Crear un div temporal para renderizar el contenido HTML
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);
      tempDiv.innerHTML = htmlContent;
  
      // Usar html2canvas para capturar la imagen del contenido HTML
      html2canvas(tempDiv, options).then((canvas) => {
        const img = canvas.toDataURL('image/PNG');
  
        // Agregar la imagen al PDF
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
  
        // Eliminar el div temporal
        document.body.removeChild(tempDiv);
  
        // Obtener el Blob del PDF
        this.pdfBlob = doc.output('blob'); // Asignar el Blob generado
        if (this.pdfBlob) {
          resolve(this.pdfBlob); // Resolver la promesa con el Blob
        } else {
          reject(new Error("No se pudo generar el PDF."));
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
 

  async sendEmail(destino:string, nombre:string, apellido:string, fecSol:any, codigo:number){
    try {
      // Asegurarse de que el PDF se genere antes de continuar
      if (!this.pdfBlob) {
        this.pdfBlob = await this.generatePdf(); // Esperar a que el PDF se genere
      }

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
            <br>
            <p>Puede descargar su certificación adjunta.</p>
        </div>
</body>
      
      `
    }
    const formData = new FormData();
    formData.append('Para', email.para);
    formData.append('Asunto', email.asunto);
    formData.append('Cuerpo', email.cuerpo);

    if (this.pdfBlob) {
      formData.append('Attachment', this.pdfBlob, 'Certificacion de existencia IS.pdf');
    } else {
      throw new Error('El PDF no se generó correctamente.');
    }
      this.emailService.sendEmail(formData).subscribe(
        response => console.log('Email enviado con éxito'),
        error => console.error('Error al enviar el email:', error)
      );
    } catch (error) {
      console.error('Error en sendEmail:', error);
    }

  }

}
