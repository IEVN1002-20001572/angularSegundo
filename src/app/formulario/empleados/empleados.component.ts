import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Importa CommonModule para standalone

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  empleadoForm: FormGroup;
  modificarForm: FormGroup;
  empleados: any[] = [];
  mostrarPanelModificar: boolean = false;
  buscarMatricula: string = '';
  empleadoSeleccionado: any;

  constructor(private fb: FormBuilder) {
    // Inicializar el formulario para agregar empleados
    this.empleadoForm = this.fb.group({
      matricula: ['', Validators.required],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],  // Validación de tipo email
      edad: ['', [Validators.required, Validators.min(18)]],
      horasTrabajadas: ['', [Validators.required, Validators.min(1)]]
    });

    // Inicializar el formulario para modificar empleados
    this.modificarForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],  // Validación de tipo email
      edad: ['', [Validators.required, Validators.min(18)]],
      horasTrabajadas: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  // Función para agregar un empleado
  agregarEmpleado(): void {
    const nuevoEmpleado = { ...this.empleadoForm.value };
    nuevoEmpleado.sueldo = this.calcularSueldo(nuevoEmpleado.horasTrabajadas);
    this.empleados.push(nuevoEmpleado);
    this.guardarEnNavegador();
    this.empleadoForm.reset();
  }

  // Función para calcular el sueldo del empleado
  calcularSueldo(horasTrabajadas: number): number {
    const pagoPorHora = 70;
    const pagoPorHoraExtra = 140;
    if (horasTrabajadas > 40) {
      return 40 * pagoPorHora + (horasTrabajadas - 40) * pagoPorHoraExtra;
    } else {
      return horasTrabajadas * pagoPorHora;
    }
  }

  // Guardar empleados en el localStorage
  guardarEnNavegador(): void {
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
  }

  // Cargar empleados desde el localStorage
  cargarEmpleados(): void {
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      this.empleados = JSON.parse(empleadosGuardados);
    }
  }

  // Eliminar un empleado por matrícula
  eliminarEmpleado(matricula: string): void {
    this.empleados = this.empleados.filter(emp => emp.matricula !== matricula);
    this.guardarEnNavegador();
  }

  // Alternar el panel de modificación
  toggleModificar(): void {
    this.mostrarPanelModificar = !this.mostrarPanelModificar;
  }

  // Buscar un empleado por matrícula para modificar
  buscarEmpleado(): void {
    this.empleadoSeleccionado = this.empleados.find(emp => emp.matricula === this.buscarMatricula);
    if (this.empleadoSeleccionado) {
      this.modificarForm.patchValue(this.empleadoSeleccionado);
    }
  }

  // Actualizar los datos del empleado seleccionado
  actualizarEmpleado(): void {
    if (this.empleadoSeleccionado) {
      Object.assign(this.empleadoSeleccionado, this.modificarForm.value);
      this.guardarEnNavegador();
      this.empleadoSeleccionado = null;
      this.modificarForm.reset();
      this.buscarMatricula = '';
    }
  }

  // Función para modificar un empleado seleccionado
  modificarEmpleado(matricula: string): void {
    const empleado = this.empleados.find(emp => emp.matricula === matricula);
    if (empleado) {
      this.modificarForm.patchValue(empleado);
      this.buscarMatricula = empleado.matricula;
      this.mostrarPanelModificar = true;  // Mostrar el panel de modificación
    }
  }

  // Función para imprimir la tabla de empleados
  imprimirEmpleados(): void {
    let ventana = window.open('', '_blank', 'width=800,height=600');
    
    // Verificamos si la ventana se abrió correctamente
    if (ventana) {
      let contenido = `
        <html>
          <head>
            <title>Lista de Empleados</title>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              .titulo {
                font-size: 24px;
                text-align: center;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="titulo">Lista de Empleados</div>
            <table>
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Edad</th>
                  <th>Horas Trabajadas</th>
                  <th>Sueldo</th>
                </tr>
              </thead>
              <tbody>`;
      this.empleados.forEach((empleado) => {
        contenido += `
                <tr>
                  <td>${empleado.matricula}</td>
                  <td>${empleado.nombre}</td>
                  <td>${empleado.correo}</td>
                  <td>${empleado.edad}</td>
                  <td>${empleado.horasTrabajadas}</td>
                  <td>${empleado.sueldo}</td>
                </tr>`;
      });
      contenido += `
              </tbody>
            </table>
          </body>
        </html>`;
      
      ventana.document.write(contenido);
      ventana.document.close();
      ventana.print();
    } else {
      console.error("No se pudo abrir la ventana para imprimir.");
    }
  }
  

  // Función para validar si el campo correo tiene un error
  get correoInvalido() {
    return this.empleadoForm.get('correo')?.invalid && this.empleadoForm.get('correo')?.touched;
  }
}
