import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ProformasService } from 'src/app/services/proformas.service';

@Component({
  selector: 'app-modal-ivadiferente',
  templateUrl: './modal-ivadiferente.component.html',
  styleUrls: ['./modal-ivadiferente.component.scss'],
})
export class ModalIvadiferenteComponent  implements OnInit {

  @Input() codigoProforma: any;
  @Input() cliente: any;
  @Input() proforma: any;
  
  opcionesIva: any;
  opcionIva: any;
  todosSeleccionados: boolean = false;
  productosSeleccionados: any[] = [];

  constructor( private modalController: ModalController,
               private proformaServices: ProformasService,
               private toastController: ToastController
              ) { }

  ngOnInit() {
    this.obtenerIva();
  }

  cerrarModalIva() {
    this.modalController.dismiss({
    });
  }

  obtenerIva(){
    this.proformaServices.obtenerIva().subscribe((resp)=>{
      if(resp.code == 200){
        this.opcionesIva = resp.data
      } 
    });
  }


  seleccionar(producto:any){
    this.productosSeleccionados =  this.proforma.proforma.filter((prod: any) => prod.Seleccionado == true)
    this.todosSeleccionados = this.productosSeleccionados.length == this.proforma.proforma.length ? true : false;  
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

  aplicarIva(){
    if(this.productosSeleccionados.length > 0 && this.opcionIva != undefined){

      let productosIva = { lineas: [] as string[] };

      this.productosSeleccionados.forEach((elemento) => {
        productosIva.lineas.push(elemento.ArticuloLineaId.toString());
      });
      
      const productosIvaString = JSON.stringify(productosIva);

      this.proformaServices.aplicarIva(this.codigoProforma, this.opcionIva.CodTarifaImpuesto, productosIvaString).subscribe((resp)=>{
        if(resp.code == 200){
          this.presentarAlerta('Cambio de Iva exitoso', 'middle');
          this.cerrarModalIva();
        }
      })
    }else{
      this.presentarAlerta('Verifica los datos', 'middle');
    }
  }

  async presentarAlerta(message: string, position: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

}
