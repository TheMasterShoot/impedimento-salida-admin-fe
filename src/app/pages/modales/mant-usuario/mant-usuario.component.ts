import { _supportsShadowDom } from '@angular/cdk/platform';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EstatusService } from '@services/estatus/estatus.service';
import { RolService } from '@services/rol/rol.service';
import { UsuarioService } from '@services/usuario/usuario.service';
import { compare } from 'fast-json-patch';
import { ToastrService } from 'ngx-toastr';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  password: string;
  rolid: number;
  estatusid: number;
}

@Component({
  selector: 'app-mant-usuario',
  templateUrl: './mant-usuario.component.html',
  styleUrl: './mant-usuario.component.scss'
})
export class MantUsuarioComponent implements OnInit {
  public estatuses: any = [];
  public roles: any = [];
  public usuarioOriginal: any = [];
  formUsuario: FormGroup;
  hide: boolean = true;
  accion:string ="Agregar"
  accionBoton: string = "Guardar";
  inputValue: string = '';
  previousValue: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public usuario: User,
    private dialogoReferencia: MatDialogRef<MantUsuarioComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private estatusService: EstatusService
  ) { 
    this.formUsuario = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['',],
    username: ['', Validators.required],
    password: ['', Validators.required], 
    rolid: ['', Validators.required],
    estatusid: ['', Validators.required],
  })

  if (this.usuario) {
    this.accion = "Editar";
    this.accionBoton = "Actualizar";
  }

  this.rolService.getRoles().subscribe({
    next: (data) => {
      const response = data.filter((rol) => rol.id !== 1);  
      this.roles = response;

        if (this.usuario)
          this.formUsuario.patchValue({
            rolid: this.usuario.rolid
          })

    },
    error: (e) => {
    },
    complete: () => {
    }
  })

  this.estatusService.getEstatuses().subscribe({
    next: (data) => {
      const response = data.filter((estatus) => estatus.tipoCodigo === 'USU');
      this.estatuses = response;

        if (this.usuario)
          this.formUsuario.patchValue({
            estatusid: this.usuario.estatusid
          })

    },
    error: (e) => {
    },
    complete: () => {
    }
  })
}
  
  ngOnInit(): void {
    if (this.usuario) {
      this.formUsuario.patchValue({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        username: this.usuario.username,
        password: this.usuario.password, 
        rolid: this.usuario.rolid,
        estatusid: this.usuario.estatusid,
      })
    }
    this.usuarioOriginal = this.usuario;
  }

  agregarEditarUsuario() {
    const _usuario: User = {
      id: this.usuario.id == null ? 0 : this.usuario.id,
      nombre: this.formUsuario.value.nombre,
      apellido: this.formUsuario.value.apellido,
      username: this.formUsuario.value.username,
      rolid: this.formUsuario.value.rolid,
      password: this.formUsuario.value.password,
      estatusid: this.formUsuario.value.estatusid
    }

    
    if (this.usuario) {
      const patch = compare(this.usuarioOriginal, _usuario);
      this.usuarioService.patchUsuario(_usuario.id, patch).subscribe({
        next: (data) => {
          console.log(data)
            this.toastr.success("El usuario fue editado con exito");
            this.dialogoReferencia.close('editado')
        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
        }
      })      
    } else {
      this.usuarioService.addUsuario(_usuario).subscribe({
        next: (data) => {
          if (data) {
            this.toastr.success("El usuario fue registrado con exito");
            this.dialogoReferencia.close('agregado')
          } else {
            this.toastr.error("No se pudo registrar el usuario");
          }
        },
        error: (e) => {
        },
        complete: () => {
        }
      })  
    }
  }

  onInputChange() {
    if (this.inputValue.length < this.previousValue.length) {
      this.inputValue = ''; // Borra todo el contenido
    }
    this.previousValue = this.inputValue; // Actualiza el valor anterior
  }

}  

