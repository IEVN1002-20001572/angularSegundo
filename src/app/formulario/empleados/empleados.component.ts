import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  empleadoForm!: FormGroup;
  modificarForm: FormGroup;
  empleados: any[] = [];
  mostrarPanelModificar: boolean = false;
  mostrarTablaImprimir: boolean = false;
  buscarMatricula: string = '';
  empleadoSeleccionado: any;
  empleadosImprimir: any[] = [];
  totalSueldo: number = 0;

  constructor(private fb: FormBuilder) {
    this.inicializarEmpleadoForm();
    this.modificarForm = this.fb.group({
      nombre: [''],
      correo: [''],
      edad: [''],
      horasTrabajadas: ['']
    });
  }

  ngOnInit(): void {
    this.cargarEmpleados();
    this.calcularTotalSueldo();
  }

  inicializarEmpleadoForm(): void {
    this.empleadoForm = this.fb.group({
      matricula: ['', Validators.required],
      nombre: [''],
      correo: [''],
      edad: [''],
      horasTrabajadas: ['']
    });
  }

  agregarEmpleado(): void {
    if (this.empleadoForm.get('matricula')?.invalid) {
      this.empleadoForm.get('matricula')?.markAsTouched();
      return;
    }
    const nuevoEmpleado = { ...this.empleadoForm.value };
    nuevoEmpleado.sueldo = this.calcularSueldo(nuevoEmpleado.horasTrabajadas);
    nuevoEmpleado.horasPorPagar = this.calcularHorasPorPagar(nuevoEmpleado.horasTrabajadas) * 70;
    nuevoEmpleado.horasExtras = this.calcularHorasExtras(nuevoEmpleado.horasTrabajadas) * 140;
    this.empleados.push(nuevoEmpleado);
    this.guardarEnNavegador();
    this.calcularTotalSueldo();

    this.empleadoForm.reset();
    this.inicializarEmpleadoForm();
    this.empleadoSeleccionado = null;
  }

  eliminarPorMatricula(): void {
    const index = this.empleados.findIndex(emp => emp.matricula === this.buscarMatricula);
    if (index !== -1) {
      this.empleados.splice(index, 1);
      this.guardarEnNavegador();
      this.calcularTotalSueldo();
      alert(`Empleado con matrícula ${this.buscarMatricula} eliminado correctamente.`);
      this.buscarMatricula = ''; // Limpiar campo de búsqueda
    } else {
      alert(`No se encontró un empleado con la matrícula ${this.buscarMatricula}.`);
    }
  }

  calcularSueldo(horasTrabajadas: number): number {
    const pagoPorHora = 70;
    const pagoPorHoraExtra = 140;
    return horasTrabajadas > 40
      ? 40 * pagoPorHora + (horasTrabajadas - 40) * pagoPorHoraExtra
      : horasTrabajadas * pagoPorHora;
  }

  calcularHorasPorPagar(horasTrabajadas: number): number {
    return horasTrabajadas > 40 ? 40 : horasTrabajadas;
  }

  calcularHorasExtras(horasTrabajadas: number): number {
    return horasTrabajadas > 40 ? horasTrabajadas - 40 : 0;
  }

  guardarEnNavegador(): void {
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
  }

  cargarEmpleados(): void {
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      this.empleados = JSON.parse(empleadosGuardados);
      this.calcularTotalSueldo();
    }
  }

  buscarEmpleado(): void {
    this.empleadoSeleccionado = this.empleados.find(emp => emp.matricula === this.buscarMatricula);
    if (this.empleadoSeleccionado) {
      this.modificarForm.patchValue(this.empleadoSeleccionado);
      this.mostrarPanelModificar = true;
    } else {
      alert('No se encontró un empleado con esa matrícula.');
      this.mostrarPanelModificar = false;
    }
  }

  actualizarEmpleado(): void {
    if (this.empleadoSeleccionado) {
      const index = this.empleados.findIndex(emp => emp.matricula === this.empleadoSeleccionado.matricula);
      const empleadoActualizado = {
        ...this.modificarForm.value,
        matricula: this.empleadoSeleccionado.matricula,
        horasPorPagar: this.calcularHorasPorPagar(this.modificarForm.value.horasTrabajadas) * 70,
        horasExtras: this.calcularHorasExtras(this.modificarForm.value.horasTrabajadas) * 140,
        sueldo: this.calcularSueldo(this.modificarForm.value.horasTrabajadas)
      };
      this.empleados[index] = empleadoActualizado;
      this.guardarEnNavegador();
      this.calcularTotalSueldo();
      this.empleadoSeleccionado = null;
      this.modificarForm.reset();
      this.mostrarPanelModificar = false;
    }
  }

  imprimirEmpleados(): void {
    this.empleadosImprimir = this.empleados.map(empleado => ({
      ...empleado,
      horasPorPagar: this.calcularHorasPorPagar(empleado.horasTrabajadas) * 70,
      horasExtras: this.calcularHorasExtras(empleado.horasTrabajadas) * 140,
    }));
    this.calcularTotalSueldo();
    this.mostrarTablaImprimir = true;
  }

  calcularTotalSueldo(): void {
    this.totalSueldo = this.empleados.reduce((total, empleado) => total + (empleado.sueldo || 0), 0);
  }

  get matriculaInvalida() {
    return this.empleadoForm.get('matricula')?.invalid && this.empleadoForm.get('matricula')?.touched;
  }
}
