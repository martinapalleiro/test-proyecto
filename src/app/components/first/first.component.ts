import {Component, Input, OnInit, ViewChild } from '@angular/core';
import { celulares } from '../../models/celulares';
import { TestService } from '../../services/test.service';
import { Data } from '../../models/data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css'] // Cambia "styleUrl" por "styleUrls"
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

  
 
  nuevoCelular: any = { name: '', price: null, color:null } // Objeto para almacenar datos del nuevo celular
 


  constructor(private testService: TestService, private modalService: NgbModal){}

  ngOnInit(): void {
      // this.name="martina"
      this.testService.getAll().subscribe((response)=>{ 
      this.celularesList=response
    })

  }
  save() {
    // Asignar valores a nuevoCelular

    this.nuevoCelular.name = this.name;
    this.nuevoCelular.data = {
        color: this.color,
        price: this.price
    };

    this.testService.add(this.nuevoCelular).subscribe(
        (response) => {
            // Insertar la nueva fila en la tabla
            this.insertTr(response);
            this.clearInputs();
        },
        (error) => {
            console.error('Error al agregar el celular:', error);
        }
    );
}

  insertTr(celular: celulares) {
    var tbody = document.getElementsByTagName('tbody')[0];
    var row = tbody.insertRow();
    row.setAttribute('id', celular.id);

    let cell: HTMLTableCellElement;

    cell = row.insertCell();
    cell.innerHTML = celular.id.toString();

    cell = row.insertCell();
    cell.innerHTML = celular.name;

    cell = row.insertCell();
    cell.innerHTML = celular.data.price.toString();

    cell = row.insertCell();
    cell.innerHTML = celular.data.color;

    cell = row.insertCell();

    //boton ver
    const viewButton = document.createElement('button');
    viewButton.innerHTML = 'Ver';
    viewButton.onclick = () => this.view(this.see, celular);
    viewButton.classList.add('angular-button');
    cell.appendChild(viewButton);
    
    //boton borrar
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Eliminar'
    deleteButton.onclick = () => this.delete(celular.id);
    deleteButton.style.background='linear-gradient(135deg, #dd0031, #b52e3b)'
    deleteButton.style.color='white'
    deleteButton.style.border='none'
    deleteButton.style.borderRadius='4px'
    deleteButton.style.padding=' 5px 10px'
    
    cell.appendChild(deleteButton);



    this.clearInputs();
}

  clearInputs() {
    document.getElementsByTagName('input')[0].value = ''
    document.getElementsByTagName('input')[1].value = ''
    document.getElementsByTagName('input')[2].value = ''
    document.getElementsByTagName('input')[0].focus()
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
    //const modalRef = ;
    
    this.modalService.open(see).result.then(() => {
      this.celulares.id = this.id2;
      this.celulares.name = this.name2;
      this.data.price = this.price2;
      this.data.color = this.color2;
      this.celulares.data = this.data;

      // Realiza la actualización del dispositivo
      this.testService.update(this.celulares).subscribe((response: celulares) => {
        document.getElementById(String(response.id))?.remove(); // Asegúrate de que el ID es una cadena
        this.insertTr(response); // Asegúrate de que esta función está definida
      }, (error: any) => {
        console.log(error);
      });
    }, (reason) => {
      // Manejo del cierre del modal si es necesario
      console.log('Modal dismissed with reason:', reason);
    });
  }



}