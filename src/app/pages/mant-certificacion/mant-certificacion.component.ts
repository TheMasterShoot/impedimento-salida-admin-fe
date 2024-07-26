import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificacionSalidaService } from '@services/certificacion/certificacion-salida.service';
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
        this.certificacionService.patchCertificacion(this.imputado.id, patch).subscribe(data =>{
            this.toastr.success('Solicitud aprobada satisfactoriamente');
            // this.sendEmail();
            this.router.navigate(['/certificaciones-pendientes']).then(() => {
              window.history.replaceState({}, '', '/');
            });
        });
      }
    });
  }

}
