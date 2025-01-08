import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  @Input() tipo: any;
  fecha: string = '';

  constructor(private modalController: ModalController) {
    this.fechaDefecto(); // Inicializa la fecha por defecto
  }

  ngOnInit() {}



  fechaDefecto() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoy.getDate().toString().padStart(2, '0');
    this.fecha = `${year}-${mes}-${dia}`; // Formato AAAA-MM-DD
  }

  async dismiss() {
    await this.modalController.dismiss(this.fecha); // Envía la fecha invertida al modal
  }
}
