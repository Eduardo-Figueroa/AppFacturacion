import { Component, Input, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { FacturacionService } from 'src/app/services/facturacion.service';
import { ModalOpcionesComponent } from '../modal-opciones/modal-opciones.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {
  ubicacionPagina: any;
  isModalOpen3 = false;


  @Input() Proforma: any;
  @Input() codigoProforma: any;
  @Input() cliente: any;
  mostrarProcesar:boolean=false;

  constructor(private router:Router,
             private facturacionService: FacturacionService,
             private alertaController: AlertController,
             private toastController: ToastController,
             private modalController: ModalController,
             
  ) { }

  ngOnInit() {
    this.ubicacionPagina = this.router.url;
    if(!this.ubicacionPagina.includes('facturacion')){
      this.mostrarProcesar = false;
    }else{
      this.mostrarProcesar = true;
    }
  }



  async abrirModalOpciones() {
    const modal = await this.modalController.create({
      component: ModalOpcionesComponent,
      backdropDismiss: false, 
      componentProps: {
        codigoProforma: this.codigoProforma,
        cliente: this.cliente
      }
    });

    modal.onDidDismiss().then(() => {
      this.router.navigate(['/facturacion']).then(() => {
       this.router.navigate(['/facturacion'], {
          queryParams: { proforma: this.codigoProforma }
        });
     });
    });

    return await modal.present();
  }

  async Inicio() {
    this.router.navigate(['/home']);
   }

   Configuracion() {
    this.router.navigate(['/configuracion']);
   }

   Opciones(){
    if(this.ubicacionPagina.includes('facturacion')){
      this.abrirModalOpciones();
    }else{
    }
   }

 elegirProcesar(){
    if(this.ubicacionPagina.includes('facturacion')){
      if(this.Proforma.proforma.length > 0 && this.Proforma.datos[0].Estado != 2 && this.Proforma.datos[0].Estado != 6){
        this.presentarAlerta('Pocesando', 'Elige si quieres procesarla como factura o proforma');
      }else{
        this.presentarMensaje('no se puede procesar', 'middle')
      }
    }else{
    }
 }

 procesar(texto: any){
  this.facturacionService.guardarProforma(this.codigoProforma, texto).subscribe(async (resp)=>{
    if(resp.code == 200){

     const headerText = texto == 'factura' ? 'factura tramitada exitosamente' : 'proforma tramitada exitosamente'
      
      const alerta = await this.alertaController.create({
        header: headerText,
        message: texto +' numero '+ resp.data.consecutivo,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              this.Inicio();
            }
          }
        ]
      })
      await alerta.present();

      
    }
  });
 }

 async presentarMensaje(message: string, position: any) {
  const msj = await this.toastController.create({
    message: message,
    duration: 1000,
    position: position,
  });

  await msj.present();
}


 async presentarAlerta(header: string, message: string) {

  const alerta = await this.alertaController.create({
    header: header,
    message: message,
    buttons: 
    [
      {
      text: 'Proforma',
      role: 'Proforma',
      handler: async () => {
        this.procesar('proforma'); 
      },
      },
      {
      text: 'Factura',
      role: 'Factura',
      handler: async () => { 
        this.procesar('factura');
      },
      },
    ]
  });
  await alerta.present();

}

async presentarAlertaSalida(header: string, message: string) {

  const alerta = await this.alertaController.create({
    header: header,
    message: message,
    buttons: 
    [
      {
      text: 'Salir',
      role: 'Proforma',
      handler: async () => {
        this.salir();
      },
      },
      {
      text: 'Cancelar',
      role: 'Cancelar',
      handler: async () => {
      },
      },
    ]
  });
  await alerta.present();

}

salir(){
  localStorage.clear();
  this.router.navigate(['/login']);
}
   
}
