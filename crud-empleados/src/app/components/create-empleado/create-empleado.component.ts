import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
createEmpleado:FormGroup;
  submitted = false;
  cargando=false;
  id:string|null;
  titulo= 'Agregar empleado' 

  constructor(private formBuilder:FormBuilder, private _EmpleadoService:EmpleadoService,
     private router:Router,private toastr: ToastrService,private approute:ActivatedRoute)
      {
    this.createEmpleado = this.formBuilder.group({
      nombre:['', Validators.required],
      apellido:['', Validators.required],
      documento:['', Validators.required],
      salario:['', Validators.required],
    });
    this.id=this.approute.snapshot.paramMap.get('id');
  };

  ngOnInit(): void {
    this.editar();
  };

  agregarEditarEmpleado( ): void {
    this.submitted = true;
      if (this.createEmpleado.invalid){
        return;
      }
      if(this.id===null){
        this.agregarEmpleado();
      }else{
        this.editarEmpleado(this.id);
      }
  
  }
  agregarEmpleado(){
    const empleado:any={
      nombre:this.createEmpleado.value.nombre,
      apellido:this.createEmpleado.value.apellido,
      documento:this.createEmpleado.value.documento,
      salario:this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()

    }
    this.cargando = true;

    this._EmpleadoService.agregarEmpleado(empleado).then(()=>{
      this.toastr.success('empleado agregado con exito','empleado registrado',{positionClass: 'toast-bottom-right'});
      this.router.navigate(['/list-empleados']); 
    }).catch(error=>{
      console.log(error);
      this.cargando = false;
    });
  }
  editarEmpleado(id:string){
    const empleado:any={
      nombre:this.createEmpleado.value.nombre,
      apellido:this.createEmpleado.value.apellido,
      documento:this.createEmpleado.value.documento,
      salario:this.createEmpleado.value.salario,
      fechaActualizacion: new Date()

    }
    this.cargando=true;

    this._EmpleadoService.editarEmpleado(id,empleado).then(()=>{
      this.cargando=false;
      this.toastr.info('empleado agregado con exito','empleado modificado',{positionClass: 'toast-bottom-right'});
    });
    this.router.navigate(['/list-empleados']);
  }

  editar(){
    this.titulo='Editar Empleado'
    
    if (this.id!=null){
      this.cargando=true;
      this._EmpleadoService.getEmpleado(this.id).subscribe(data => {
        this.cargando=false;
        this.createEmpleado.setValue({
          nombre:data.payload.data()['nombre'],
          apellido:data.payload.data()['apellido'],
          documento:data.payload.data()['documento'],
          salario:data.payload.data()['salario']

        })
      })
    }else{
      this.titulo='Agregar Empleado';
    }
  }
}