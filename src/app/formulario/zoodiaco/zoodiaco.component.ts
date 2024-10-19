import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-zoodiaco',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './zoodiaco.component.html',
  styleUrls: ['./zoodiaco.component.css']
  
})
export class ZoodiacoComponent implements OnInit {
  formulario!: FormGroup;
  resultado: string = '';
  imagenSigno: string = '';
  dia: any;
  mes: any;
  anio: any;
  edad: number | undefined;

  constructor() {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellidop: new FormControl('', Validators.required),
      apellidom: new FormControl('', Validators.required),
      fechaNacimiento: new FormControl('', Validators.required),
      genero: new FormControl('', Validators.required)
    });
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    
    if (
        hoy.getMonth() < fechaNacimiento.getMonth() ||
        (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate()) ||
        (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() === fechaNacimiento.getDate() && hoy.getHours() < fechaNacimiento.getHours())
    ) {
        edad--;
    }
    return edad;
}
  calcularZodiacoChino(anio: number): { signo: string, imagenUrl: string } {
    const signosChinos = [
      { signo: 'Rata', imagenUrl: 'https://2.bp.blogspot.com/-KS69FSM2LEs/WnaadAPWNqI/AAAAAAAAEkM/onmOve7dA2Y_0levLe7a3A5oqqMR2CxqwCEwYBhgL/s1600/rata%2Bhoroscopo%2Bchino.jpg' },
      { signo: 'Buey', imagenUrl: 'https://www.euroresidentes.com/horoscopo-chino/2017/imagenes/ox-euroresidentes.jpg' },
      { signo: 'Tigre', imagenUrl: 'https://www.euroresidentes.com/horoscopo-chino/2017/imagenes/tiger-euroresidentes.jpg' },
      { signo: 'Conejo', imagenUrl: 'https://diccionariodesimbolos.org/wp-content/uploads/2021/04/Conejo.jpg' },
      { signo: 'Dragón', imagenUrl: 'https://static.vecteezy.com/system/resources/previews/002/185/143/original/chinese-zodiac-sign-animal-dragon-cartoon-lunar-astrology-drawing-vector.jpg' },
      { signo: 'Serpiente', imagenUrl: 'https://t4.ftcdn.net/jpg/01/01/46/53/500_F_101465379_7AYscr3nl2khXZiO1GMX0TVDihLiDpIB.jpg' },
      { signo: 'Caballo', imagenUrl: 'https://diccionariodesimbolos.org/wp-content/uploads/2021/03/horse-euroresidentes.jpg' },
      { signo: 'Cabra', imagenUrl: 'https://www.kindpng.com/picc/m/685-6856152_chinese-zodiac-goat-hd-png-download.png' },
      { signo: 'Mono', imagenUrl: 'https://c8.alamy.com/comp/DN8AW9/chinese-zodiac-animal-monkey-DN8AW9.jpg' },
      { signo: 'Gallo', imagenUrl: 'https://th.bing.com/th/id/OIP.QkdK687ooXVowITtM0h3yAHaH0?rs=1&pid=ImgDetMain' },
      { signo: 'Perro', imagenUrl: 'https://th.bing.com/th/id/R.e4dc828bf7ddf1aacbdb09c16291fc2c?rik=COz%2b8TOxdMknsA&pid=ImgRaw&r=0' },
      { signo: 'Cerdo', imagenUrl: 'https://st.depositphotos.com/1647366/2315/v/950/depositphotos_23151630-stock-illustration-chinese-zodiac-animal-pig.jpg' }
    ];
    const indice = (anio - 1900) % 12;
    return signosChinos[indice];
  }

  imprimirResultado(): void {
    if (this.formulario.valid) {
      const fechaNacimiento = new Date(this.formulario.get('fechaNacimiento')?.value);
      const anioNacimiento = fechaNacimiento.getFullYear();
      const edad = this.calcularEdad(fechaNacimiento);
      const { signo, imagenUrl } = this.calcularZodiacoChino(anioNacimiento);

      this.resultado = `Hola ${this.formulario.get('nombre')?.value} ${this.formulario.get('apellidop')?.value} ${this.formulario.get('apellidom')?.value}, Tu edad es: ${edad} años y tu signo zodiacal es: ${signo}.`;
      this.imagenSigno = imagenUrl;
    }
  }
}
