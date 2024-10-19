import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ejemplo1Component } from './formulario/ejemplo1/ejemplo1.component';
import { ZoodiacoComponent } from './formulario/zoodiaco/zoodiaco.component';
import { EmpleadosComponent } from './formulario/empleados/empleados.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Ejemplo1Component, ZoodiacoComponent, EmpleadosComponent],  // Ahora se puede importar
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularSegundo';

  mostrarEjemplo1 = false;
  mostrarZoodiaco = false;
  mostrarEmpleados = false;

  mostrarComponente(componente: string) {
    this.mostrarEjemplo1 = componente === 'ejemplo1';
    this.mostrarZoodiaco = componente === 'zoodiaco';
    this.mostrarEmpleados = componente === 'empleados';
  }
}
