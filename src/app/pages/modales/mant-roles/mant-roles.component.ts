import { _supportsShadowDom } from '@angular/cdk/platform';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RolService } from '@services/rol/rol.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mant-roles',
  templateUrl: './mant-roles.component.html',
  styleUrl: './mant-roles.component.scss'
})
export class MantRolesComponent implements OnInit {
  formRol: FormGroup;
  hide: boolean = true;
  accion:string ="Agregar"
  accionBoton: string = "Guardar";

  constructor(
    @Inject(MAT_DIALOG_DATA) public rol: any,
    private dialogoReferencia: MatDialogRef<MantRolesComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private rolService: RolService
  ) { 
    this.formRol = this.fb.group({
    rol: ['', Validators.required],
  })

  if (this.rol) {
    this.accion = "Editar";
    this.accionBoton = "Actualizar";
  }   
}
  
  ngOnInit(): void {
    if (this.rol) {
      this.formRol.patchValue({
        rol: this.rol.rol
      })
    }
  }

  agregarEditarRol() {
    const _rol: any = {
      id: this.rol.id == null ? 0 : this.rol.id,
      rol: this.formRol.value.rol
    }

    
    if (this.rol) {
      this.rolService.updateRol(_rol).subscribe({
        next: (data) => {
          console.log(data)
            this.toastr.success("El rol fue editado con exito");
            this.dialogoReferencia.close('editado')
        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
        }
      })      
    } else {
      this.rolService.addRol(_rol).subscribe({
        next: (data) => {
          if (data) {
            this.toastr.success("El rol fue registrado con exito");
            this.dialogoReferencia.close('agregado')
          } else {
            this.toastr.error("No se pudo registrar el rol");
          }
        },
        error: (e) => {
        },
        complete: () => {
        }
      })  
    }
  }

}  

