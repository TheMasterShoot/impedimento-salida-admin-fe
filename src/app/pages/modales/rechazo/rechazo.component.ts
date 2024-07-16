import { _supportsShadowDom } from '@angular/cdk/platform';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
        // this.imputado1 = Object.assign({}, data);
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
        // this.sendEmail();
        this.dialogoReferencia.close('completado');
      });
    } else {
      this.rechazoService.addRechazo(_rechazo).subscribe((data: any) => {
        this.toastr.success("Solicitud rechazada satisfactoriamente");
        // this.sendEmail();
        this.dialogoReferencia.close('completado');
      });
    }

  }

}  

