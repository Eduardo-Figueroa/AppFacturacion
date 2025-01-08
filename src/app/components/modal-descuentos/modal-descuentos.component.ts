import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ProformasService } from 'src/app/services/proformas.service';

@Component({
  selector: 'app-modal-descuentos',
  templateUrl: './modal-descuentos.component.html',
  styleUrls: ['./modal-descuentos.component.scss'],
})
export class ModalDescuentosComponent  implements OnInit {

  @Input() codigoProforma: any;
  @Input() proforma: any;
  @Input() clienteSeleccionado:any;
  todosSeleccionados: boolean = false;
  productosSeleccionados: any[] = [];
  descuento: any;

  constructor(private modalController: ModalController,
              private proformasService: ProformasService,
              private alertaController: AlertController,
              private toastController: ToastController
              ) { }

  ngOnInit() {

    this.proforma.proforma.forEach((item:any)=>{
     item.Seleccionado = 'false';
  
    });

  }

  cerrarModalDescuentos() {
    this.modalController.dismiss();
  }

  seleccionTodos(){
    this.productosSeleccionados = [];
    this.proforma.proforma.forEach((item: any) => {

      item.Seleccionado = this.todosSeleccionados

      if(!this.todosSeleccionados){
        this.productosSeleccionados = [];
      }else{
        this.productosSeleccionados.push(item);
      }    
  });
  }

  seleccionar(producto:any){
    this.productosSeleccionados =  this.proforma.proforma.filter((prod: any) => prod.Seleccionado == true)
    this.todosSeleccionados = this.productosSeleccionados.length == this.proforma.proforma.length ? true : false;  
  }

  aplicarDescuento(){
    if(this.productosSeleccionados.length > 0){
      let productosDescuento: { [key: string]: { linea: number; articulo: string; descuento: number } } = {};

      this.productosSeleccionados.forEach(elemento => {
        productosDescuento = {
          ...productosDescuento,
          [elemento.ArticuloLineaId]: {
            "linea": elemento.ArticuloLineaId,
            "articulo": elemento.ArticuloCodigo,
            "descuento": this.descuento
          }
        };
      });
  
      this.proformasService.aplicarDescuentos(this.codigoProforma, JSON.stringify(productosDescuento)).subscribe((resp)=>{
        if(resp.code == 200){
          if(resp.errores.length > 0){
            let mensajeErrores = resp.errores.map((elemento: any) => elemento).join('\n');
            this.presentarAlerta('Descuento parcial', mensajeErrores);
            this.cerrarModalDescuentos();
          }else{
            this.presentarAlerta('Descuento', 'Descuento realizado con exito');
            this.cerrarModalDescuentos();
          }
        }else{
          let mensajeErrores = resp.errores.map((elemento: any) => elemento).join('\n');
            this.presentarAlerta('Descuento no realizado', mensajeErrores);
            this.cerrarModalDescuentos();
        }
      })
    }else{
      this.presentarMensaje('Por favor seleccione productos', 'middle');
    }

  }

    async presentarAlerta(header: string, message: string) {
    const alerta = await this.alertaController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
    });

    await alerta.present();
  }

  async presentarMensaje(message: string, position: any) {
    const msj = await this.toastController.create({
      message: message,
      duration: 1000,
      position: position,
    });
  
    await msj.present();
  }
}
