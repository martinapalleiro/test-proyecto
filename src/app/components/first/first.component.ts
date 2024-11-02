import {Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { celulares } from '../../models/celulares';
import { TestService } from '../../services/test.service';
import { Data } from '../../models/data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-first', // El nombre del componente, usado en HTML
  templateUrl: './first.component.html', // Ruta del archivo HTML que define el template
  styleUrls: ['./first.component.css'] // Ruta del archivo CSS que contiene los estilos para este componente
})

export class FirstComponent implements OnInit {
  celularesList=new Array<celulares>()
  celulares=new celulares()
  data=new Data()
  @Input() name: string
  @Input() price: number
  @Input() color: string
  @Input() id2: string
  @Input() name2: string
  @Input() price2: number
  @Input() color2: string

  @ViewChild('see') see: any
  isAdding: boolean = false; 

  @ViewChild('nameInput') nameInput!: ElementRef; //busca un elemento en el template que tenga una referencia local llamada nameInput,
  // se asume que no será null ni undefined en el momento de su uso. 
  //ElementRef: Permite manipular el elemento directamente a través de su propiedad nativeElement
  @ViewChild('priceInput') priceInput!: ElementRef;
  @ViewChild('colorInput') colorInput!: ElementRef;

  @ViewChild('nameInput2') nameInput2!: ElementRef;
  @ViewChild('priceInput2') priceInput2!: ElementRef;
  @ViewChild('colorInput2') colorInput2!: ElementRef;
 
  nuevoCelular: any = { name: '', price: null, color:null } // Objeto para almacenar datos del nuevo celular
 


  constructor(private testService: TestService, private modalService: NgbModal){}

  ngOnInit(): void { // Método que se ejecuta una vez que el componente ha sido inicializado
    this.testService.getAll() // Llama al método getAll() del servicio testService
      .subscribe((response) => { // Se suscribe al observable para recibir la respuesta
        this.celularesList = response; // Asigna la respuesta a la propiedad celularesList
      });
  }
  
  save() {
    if (this.isAdding) return;
    this.isAdding = true;

    if (!this.name) {
      this.nameInput.nativeElement.focus(); // Foco en el campo vacío
      this.isAdding = false;
      return;
    }

    if (!this.color) {
      this.colorInput.nativeElement.focus(); // Foco en el campo vacío
      this.isAdding = false;
      return;
    }

    if (this.price === null || this.price === undefined) {
      this.priceInput.nativeElement.focus(); // Foco en el campo vacío
      this.isAdding = false;
      return;
    }

    // Asignar valores a nuevoCelular
    this.nuevoCelular.name = this.name;
    this.nuevoCelular.data = {
      color: this.color,
      price: this.price
    };

    this.testService.add(this.nuevoCelular).subscribe( // Llama al método add del servicio para agregar un nuevo celular
      (response) => {
        this.insertTr(response); // en caso que sea una respuesta exitosa se agrega el celular
        this.clearInputs();
        this.isAdding = false;
      },
      (error) => {
        console.error('Error al agregar el celular:', error);
        this.isAdding = false; 
      }
    );
  
}

  insertTr(celular: celulares) {
    var tbody = document.getElementsByTagName('tbody')[0]; // Obtiene el primer elemento <tbody> en el documento
    var row = tbody.insertRow();
    row.setAttribute('id', celular.id.toString()); // Establece el ID de la fila usando el ID del celular

    let cell: HTMLTableCellElement;  // Declara una variable para las celdas de la fila

    cell = row.insertCell();
    cell.innerHTML = celular.id.toString();

    cell = row.insertCell();
    cell.innerHTML = celular.name;

    cell = row.insertCell();
    cell.innerHTML = celular.data.price.toString();

    cell = row.insertCell();
    cell.innerHTML = celular.data.color;

    cell = row.insertCell();



  // Crear un contenedor para los botones
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex'; // Usar flexbox
  buttonContainer.style.alignItems = 'center'; // Alinear verticalmente

  // botón ver
  const viewButton = document.createElement('button');
  viewButton.innerHTML = 'Ver';
  viewButton.onclick = () => this.view(this.see, celular);
  viewButton.style.background = 'linear-gradient(135deg, #dd0031, #b52e3b)';
  viewButton.style.color = 'white';
  viewButton.style.border = 'none';
  viewButton.style.borderRadius = '4px';
  viewButton.style.padding = '5px 10px';
  viewButton.style.marginRight = '10px';

  buttonContainer.appendChild(viewButton);

  // botón borrar
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Eliminar';
  deleteButton.onclick = () => this.delete(celular.id);
  deleteButton.style.background = 'linear-gradient(135deg, #dd0031, #b52e3b)';
  deleteButton.style.color = 'white';
  deleteButton.style.border = 'none';
  deleteButton.style.borderRadius = '4px';
  deleteButton.style.padding = '5px 10px';
  buttonContainer.appendChild(deleteButton);

  // Añadir el contenedor de botones a la celda
  cell.appendChild(buttonContainer);

  this.clearInputs();
}

clearInputs() {
  this.name = '';
  this.color = '';
  this.price =0;
}
 

  delete(id: string): void {
    this.testService.delete(id).subscribe({
      next: response => {
        document.getElementById(id)?.remove()
        console.log('Eliminado correctamente', response);
      },
      error: err => {
        console.error('Error al eliminar', err);
      }
    });
  }

  view(see: any, celu: celulares) {
    // Almacena datos del dispositivo
    this.id2 = celu.id;
    this.name2 = celu.name;
    this.price2 = celu.data.price;
    this.color2 = celu.data.color;
  
    // Abre el modal
    this.modalService.open(see).result.then((result) => {
      // No es necesario hacer nada aquí por ahora
    }, (reason) => {
      console.log('Modal dismissed with reason:', reason);
    });
  }
  

  update(modal: any) {
    // Verifica si todos los campos están vacíos
    if (!this.name2) {
      this.nameInput2.nativeElement.focus(); // Establece el foco en el campo de nombre
      return; // Sale del método si el campo de nombre está vacío
    }
  
    if (!this.color2) {
      this.colorInput2.nativeElement.focus();
      return; 
    }
  
    if (this.price2 === null || this.price2 === undefined) {
      this.priceInput2.nativeElement.focus(); 
      return; 
    }
  
    // Actualiza el objeto celulares con los valores modificados
    this.celulares.id = this.id2;
    this.celulares.name = this.name2;
    this.celulares.data = {
      price: this.price2,
      color: this.color2
    };
  
    // Realiza la actualización del dispositivo
    this.testService.update(this.celulares).subscribe(
      (response: celulares) => {
        document.getElementById(String(response.id))?.remove(); // Elimina la fila anterior del celular en la tabla
        this.insertTr(response); // Inserta la nueva fila con los datos actualizados
        modal.close(); // Cierra el modal después de la actualización
      },
      (error: any) => {
        console.log('Error al actualizar el celular:', error); 
      }
    );
  }
}