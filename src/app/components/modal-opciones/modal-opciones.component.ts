import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ProformasService } from 'src/app/services/proformas.service';
import { ModalIvadiferenteComponent } from '../modal-ivadiferente/modal-ivadiferente.component';
import { PdfService } from 'src/app/services/pdf.service';
import { BluetoothLe } from '@capacitor-community/bluetooth-le';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ModalBluetoothComponent } from '../modal-bluetooth/modal-bluetooth.component';

@Component({
  selector: 'app-modal-opciones',
  templateUrl: './modal-opciones.component.html',
  styleUrls: ['./modal-opciones.component.scss'],
})
export class ModalOpcionesComponent  implements OnInit {

  @Input() codigoProforma: any;
  @Input() cliente: any;
  @Input() proforma: any;
  permisosUsuario: any;


  constructor(private modalController: ModalController,
              private proformaServices: ProformasService,
              private alertaController: AlertController,
              private toastController: ToastController,
              private bluetoothSerial: BluetoothSerial
              
  ) { }

  ngOnInit() {
    this.permisosUsuario = JSON.parse(localStorage.getItem('PermisosUsuario') || '[]');
  }
 
   
  tienePermiso(permiso: string): boolean {
    return this.permisosUsuario.includes(permiso);
  }

  cerrarModalOpciones() {
    this.modalController.dismiss({
      codigoProforma: this.codigoProforma
    });
  }

  LimpiarProforma(){
    if(this.proforma.datos[0].Estado != 2 && this.proforma.datos[0].Estado != 6){
      this.proformaServices.limpiarProforma(this.codigoProforma).subscribe((resp)=>{
        if(resp.code == 200){
          this.presentarAlerta('proforma limpia', 'middle');
  
          this.cerrarModalOpciones();
         
        }
      });
    }else{
      this.presentarMensaje('No es posible limpiar la proforma', 'middle');
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

  async Alerta(header: string, message: string) {
    const alerta = await this.alertaController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.LimpiarProforma();
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
          }
        }
      ]
    })
  

    await alerta.present();
  }

  exonerarFactura(){
    if(this.proforma.datos[0].Estado != 2 && this.proforma.datos[0].Estado != 6){
      this.proformaServices.exonerarFactura(this.codigoProforma, (this.cliente.codigo || this.cliente.ClienteID)).subscribe((resp)=>{
        if(resp.code == 200){
          this.presentarAlerta(resp.data, 'middle')
          this.cerrarModalOpciones();
        }else{
          this.presentarAlerta(resp.data, 'middle')
  
        }
      });
    }else{
      this.presentarMensaje('No es posible exonerar la factura', 'middle');
    }
    
  }

  quitarExonerar(){
    if(this.proforma.datos[0].Estado != 2 && this.proforma.datos[0].Estado != 6){
      this.proformaServices.quitarExonerarFactura(this.codigoProforma).subscribe((resp)=>{
        if(resp.code == 200){
          this.presentarAlerta(resp.data, 'middle')
          this.cerrarModalOpciones();
        }else{
          this.presentarAlerta(resp.data, 'middle')
  
        }
      });
    }else{
      this.presentarMensaje('No es posible quitar la exoneracion', 'middle');
    }
    
  }

  facturarACosto(){
    if(this.proforma.datos[0].Estado != 2 && this.proforma.datos[0].Estado != 6){
      this.proformaServices.facturarACosto(this.codigoProforma).subscribe((resp)=>{
        if(resp.code == 200){
          this.presentarAlerta(resp.data, 'middle')
          this.cerrarModalOpciones();
        }else{
          this.presentarAlerta(resp.data, 'middle')
        }
      }); 
    }else{
      this.presentarMensaje('No es posible facturar a costo', 'middle');
    }
      
  }

  refrescar(){
    this.cerrarModalOpciones();
  }

  async ivaDiferente(){
    if(this.proforma.datos[0].Estado != 2 && this.proforma.datos[0].Estado != 6){
      const modal = await this.modalController.create({
        component: ModalIvadiferenteComponent,
        backdropDismiss: false, 
        componentProps: {
          codigoProforma: this.codigoProforma,
          cliente: this.cliente,
          proforma: this.proforma
        }
      });
      modal.onDidDismiss().then(() => {
        this.cerrarModalOpciones();
      });
  
      return await modal.present();
    }else{
      this.presentarMensaje('No es posible cambiar el iva', 'middle');
    }
  }

  async presentarMensaje(message: string, position: any) {
    const msj = await this.toastController.create({
      message: message,
      duration: 1000,
      position: position,
    });
  
    await msj.present();
  }

   async Imprimir(){
    const modal = await this.modalController.create({
      component: ModalBluetoothComponent,
      backdropDismiss: false, 
      componentProps: {
        codigoProforma: this.codigoProforma,
        cliente: this.cliente,
        proforma: this.proforma
      }
    });
    modal.onDidDismiss().then(() => {
      this.cerrarModalOpciones();
    });

    return await modal.present();

    
   

  //   try {
  //     await BluetoothLe.initialize(); 
  //     const result = await BluetoothLe.requestLEScan({ allowDuplicates: false });
      
      
  //     BluetoothLe.addListener('onScanResult', (info) => {
        
  //       // Descompón el objeto para mostrar propiedades específicas
  //       const device = info;
  //       // alert('Device deviceId:'+ device.device.deviceId);
  //       // alert('Device name:'+ device.device.name);
  //       // alert('Device rawAdvertisement:'+ device.rawAdvertisement);
  //       // alert('Device rssi:'+ device.rssi);
  //       // alert('Device txPower:'+ device.txPower);
  //       // alert('Device manufacturerData:'+ device.manufacturerData);
  //       // alert('Device serviceData:'+ device.serviceData);
  //       //  alert('Device uuids:'+ device.uuids);
  //       this.AlertaImpresora(`Conectarse a: ${device.localName}`, '', device);
  //      ;
  
  //       // Puedes agregar lógica para manejar el dispositivo encontrado
  //     });
      
  //     // Detener el escaneo después de un tiempo si es necesario
  //     setTimeout(async () => {
  //       await BluetoothLe.stopLEScan();
  //       alert('Scan stopped');
  //     }, 10000); // escanear por 10 segundos
      
  //   } catch (error) {
  //     alert('Error during scan:'+ error);
  //   }

  //   // var dd = {
  //   //   content: [
  //   //     {
  //   //       text: 'DEMO TIENDA (EMPRESA DE PRUEBA)',
  //   //       style: 'header'
  //   //     },
  //   //     {
  //   //       text: 'DEMO TIENDA S.A.',
  //   //       style: 'header'
  //   //     },
  //   //     {
  //   //       text: 'IDENTIFICACION: 109690498',
  //   //       style: 'header'
  //   //     },
  //   //     {
  //   //       text: 'HORARIO: 7:00 AM A 4:30 PM',
  //   //       style: 'header'
  //   //     },
  //   //     {
  //   //       text: 'FACTURA ELECTRONICA EFECTIVO',
  //   //       style: 'subheader'//margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //       text: 'DOC: 00200001010000001912',
  //   //       style: 'subheader'//margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //       text: 'CLAVE: 5060309240001096904980020\n0001010000001912199999999',
  //   //       style: 'subheader'//margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //       text: 'FECHA: 03/09/2024 16:34',
  //   //       style: 'subheader'//margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //         text: '_ _ _ _ _ _ _ _ _ _ _ _ _ _ __ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ',
  //   //     },
  //   //     {
  //   //       text: '*** DATOS DEL CLIENTE ***',
  //   //      style: 'subheader'// margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //       text: 'Roberto Reyes Garcia',
  //   //      style: 'header'// margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //       text: 'CODIGO: 242',
  //   //      style: 'subheader'// margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //       text: 'CEDULA: 119200302624',
  //   //      style: 'subheader'// margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //       text: 'NOMBRE: Roberto Reyes Garcia',
  //   //      style: 'subheader'// margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //       text: 'TELS: 88856677',
  //   //      style: 'subheader'// margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //       text: 'EMAIL: rreyes.pruebas@gmail.com',
  //   //      style: 'subheader'// margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //         text: '_ _ _ _ _ _ _ _ ',
  //   //         style: 'header'
  //   //     },
  //   //     {
  //   //       text: 'CANT/COD/NOMBRE/PRECIO/TOTAL',
  //   //       style: 'header'
  //   //     },
     
  //   //     {
  //   //         text: '_ _ _ _ _ _ _ _ _ ',
  //   //         style: 'header'
  //   //     },
  //   //     {
  //   //       text: '*******RESUMEN IVA*****\nIVA% VENTA IVA\n(13%) 7,725.66 1,004.33',
  //   //      style: 'subheader'// margin: [0, 10, 0, 10]
  //   //     },
  //   //     {
  //   //         text: '_ _ _ _ _ _ _ _ _ _ _ _ _ _ __ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ',
  //   //     },
  //   //     {
  //   //       text: 'REF:\nEFECTIVO CRC 8,729.99\nENTRE: LOCAL PED:\nSALDO A FAVOR 1,511,680.00\nCAJA:1 VEND: ROBERTO-ADMINAGEN: ROBERTO-ADMIN\nB=BODEGA, D=DESC, G=CON IVA\nDESARROLLADO POR SOPORTE REAL\nAUTOR. RESOL.DGT-R-033-2019 DE 20-06-2019 DE LA D.G.T.D\nORIGINAL V.4.3 C=1',
  //   //      style: 'subheader'// margin: [0, 10, 0, 10]
  //   //     }
  //   //   ],
  //   //   styles: {
  //   //     header: {
  //   //       fontSize: 35,
  //   //       bold: true
  //   //     },
  //   //     subheader: {
  //   //       fontSize: 30,
  //   //       bold: false
  //   //     },
  //   //   }
     
  //   // };
  //   // let lugar = 19;
  //   // this.proforma.proforma.forEach((elemento:any) => {
  //   //   console.log(elemento)
  //   //   const contentToAdd = {
  //   //     text: elemento.ArticuloCantidad +' / '+elemento.ArticuloCodigo +' /'+ elemento.Descripcion + '/ '+elemento.PrecioUd +' /' + elemento.ArticuloVentaTotal+'\n',
  //   //     style: 'subheader',
  //   //   };
    
  //   //   dd.content.splice(lugar, 0, contentToAdd);
  //   //   lugar++;
  //   // });
  //   // console.log(dd)
  //   // this.pdfServices.downloadPdf(dd);

    
  // }

  // convertToDataView(arrayBuffer: ArrayBuffer): DataView {
  //   return new DataView(arrayBuffer);
  // }

  // async connectToDevice(deviceId: string, device:any) {
  //   try {
  //     const connection = await BluetoothLe.connect({ deviceId });
  //       try {
  //         //const dataView = this.convertToDataView();
  //         const writeResponse = await BluetoothLe.write({
  //           deviceId: deviceId, // ID del dispositivo
  //           service: device.uuids, //'your-service-uuid',
  //           characteristic: device.rssi,
  //           value: 'dsds' //new TextEncoder().encode('101101').buffer,
  //         });
  //         alert('Write response:'+ writeResponse);
  //       } catch (error) {
  //         alert('Error writing to device:'+ error);
  //       }
      
  //   } catch (error) {
  //     alert('Error connecting to device:'+ error);
  //   }
  // }

  
  

  // async AlertaImpresora(header: string, message: string, device: any) {
  //   const alerta = await this.alertaController.create({
  //     header: header,
  //     message: message,
  //     buttons: [
  //       {
  //         text: 'Aceptar',
  //         handler: () => {
  //           this.pdfServices.print(device.device.deviceId);
  //         }
  //       },
  //       {
  //         text: 'Cancelar',
  //         handler: () => {
  //         }
  //       }
  //     ]
  //   })
  

  //   await alerta.present();
  }
}
