import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BleClient, BluetoothLe } from '@capacitor-community/bluetooth-le';
import { PdfService } from 'src/app/services/pdf.service';
import { EchoService  } from 'src/app/services/socket.service';



@Component({
  selector: 'app-modal-bluetooth',
  templateUrl: './modal-bluetooth.component.html',
  styleUrls: ['./modal-bluetooth.component.scss'],
})
export class ModalBluetoothComponent  implements OnInit {

  @Input() codigoProforma: any;
  @Input() cliente: any;
  @Input() proforma: any;
  permisosUsuario: any;
  dispositivos: any[] = [];
  ble: boolean =false;
  dd: any;
  Perfil: any;
  messages: string[] = [];
  message: string = '';

  constructor(private modalController: ModalController,
              private bluetoothSerial: BluetoothSerial,
              private change: ChangeDetectorRef,
              private pdfServices: PdfService,
              private loadingCtrl: LoadingController,
              private alertaController: AlertController,
              private echoService: EchoService
            ) { }

  ngOnInit() {
    this.activarBluetooth();
    this.obtenerUsuario();
    console.log(this.proforma)

    this.echoService.listen('nombre-del-canal', 'NombreDelEvento', (data) => {
      console.log('Received data:', data);
    });
    
  }

  // enviarDatosSocket() {
 
  //     this.socketService.sendMessage('|>>MODSEGU000.00.MODSEGU009ß09029ßMODßDEMOFERREßDEMOFERREßEnd<<|');
  
  // }
  // conectarSocket() {
  //   this.socket = io('http://localhost:555'); // Verifica que el puerto sea correcto
  //   this.socket.on('connect', () => {
  //     console.log('Conectado al socket');
  //   });
  
  //   this.socket.on('connect_error', (error) => {
  //     console.error('Error de conexión:', error);
  //   });
  // }

  // enviarDatosSocket() {
  //   const data = 'MODSEGU000.00.MODSEGU009ß09029ßMODßDEMOFERREßDEMOFERREßENDß';
  //   this.socket.emit('message', data); // Cambia 'message' al nombre del evento que tu servidor espera
  // }




  obtenerUsuario(){
    const perfilStr = localStorage.getItem('Usuario');
    let perfil: {} = {};
    if (perfilStr) {
      this.Perfil = JSON.parse(perfilStr);
    }
    return this.Perfil;
  }

  cerrarModalImprimir() {
    this.modalController.dismiss({
      codigoProforma: this.codigoProforma
    });
  }

  activarBluetooth(){
    BleClient.initialize().then(() => {
      BleClient.isEnabled().then((resp) => {
        if(resp){
          this.ble = true;
        }else{
          BleClient.enable();
        }
      })
    })
  }

  async cargando() {
    const cargando = await this.loadingCtrl.create({
      message: 'Buscando dispositivos...',
      duration: 5000,
    });

    cargando.present();
  }

  scanear(){
    BleClient.requestLEScan({allowDuplicates: false}, (resp1) => {
      if(resp1.localName){
        this.dispositivos.push(resp1);
        this.change.detectChanges();
      }
    })
      BluetoothLe.stopLEScan().then(()=>{
       this.cargando();
      })

  }

  conectar(device:any, index:any){
    this.presentarAlerta('Desea Imprimir?', 'Se imprimirá el recibo generado', device, index);
  }

  imprimir(device:any, index:any){
    BleClient.connect(device.device.deviceId).then(()=> {
      this.dispositivos[index]["conectado"] = true;
      this.change.detectChanges();
      const subTotal = parseFloat(this.proforma.totales[0].TotalGravado) + parseFloat(this.proforma.totales[0].TotalDescuento);
    this.dd = {
      content: [
        {
          text: 'DEMO TIENDA (EMPRESA DE PRUEBA)\n',
          style: 'header'
        },
        {
          text: 'DEMO TIENDA S.A.',
          style: 'subheader'
        },
        {
          text: 'IDENTIFICACION:4356345435',
          style: 'subheader'
        },
        {
          text: '\nHORARIO: 7:00 AM A 4:30 PM',
          style: 'subheader'
        },
        {
          text: 'FACTURA ELECTRONICA EFECTIVO\nDOC: 00200001010000001912\nCLAVE: 5060309240001096904980020\n0001010000001912199999999\nFECHA: 03/09/2024 16:34\n',
          style: 'subheader'//margin: [0, 10, 0, 10]
        },
        {
          text: '*** DATOS DEL CLIENTE ***\n',
         style: 'subheader'// margin: [0, 10, 0, 10]
        },
        {
          text:  this.proforma.cliente[0].ClienteNombre,
         style: 'header'// margin: [0, 10, 0, 10]
        },
        {
          text: 'CODIGO:'+ this.proforma.cliente[0].ClienteID +'\nCEDULA:'+ this.proforma.cliente[0].Cedula +'\nNOMBRE:'+ this.proforma.cliente[0].ClienteNombre +'\nTELS:'+ this.proforma.cliente[0].Telefonos +'\nEMAIL:'+ this.proforma.cliente[0].EmailFactura +'\n',
         style: 'subheader'// margin: [0, 10, 0, 10]
        },
        {
          text: 'CANT/COD/NOMBRE/PRECIO/TOTAL\n----------------------------',
          style: 'subheader'
        },
        {
          text: 'SUBTOTAL: '+ subTotal +'\nDESCUENTO: '+ this.proforma.totales[0].TotalDescuento +'\nMERC GRAVADA: '+ this.proforma.totales[0].TotalGravado +'\nIVA: '+ this.proforma.totales[0].TotalIva +'\n----------------------------'
          ,
         style: 'subheader'// margin: [0, 10, 0, 10]
        },
        {
          text: 'TOTAL: '+this.proforma.totales[0].Total +'\n----------------------------'
          ,
         style: 'subheader'// margin: [0, 10, 0, 10]
        },
        {
          text: '\n*******RESUMEN IVA*****\nIVA% / VENTA / IVA\n',
         style: 'subheader'// margin: [0, 10, 0, 10]
        },
        // {
        //     text: '_ _ _ _ _ _ _ _ _ _ _ _ _ _ __ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ',
        // },
        {
          text: 'REF:\nEFECTIVO CRC 8,729.99\nVEND:'+ this.Perfil.Nombre +'AGEN: ROBERTO-ADMIN\nB=BODEGA, D=DESC, G=CON IVA\nDESARROLLADO POR SOPORTE REAL\nAUTOR. RESOL.DGT-R-033-2019 DE 20-06-2019 DE LA D.G.T.D\n',
         style: 'subheader'// margin: [0, 10, 0, 10]
        },
        {
          text: 'ORIGINAL V.4.3 C=1\n',
         style: 'header'// margin: [0, 10, 0, 10]
        }
      ],
     
    };
    let lugarProducto = 9;
    let lugarIva = 13;
    this.proforma.proforma.forEach((elemento:any) => {
      console.log(elemento)
      const producto = {
        text: elemento.ArticuloCantidad +' / '+elemento.ArticuloCodigo +' /'+ elemento.Descripcion + '/ '+elemento.PrecioUd +' /' + elemento.ArticuloVentaTotal+'\n----------------------------',
        //style: 'subheader',
      };
      this.dd.content.splice(lugarProducto, 0, producto);
      
      lugarProducto++;
      
    });

    this.proforma.ivas.forEach((elemento:any) => {
      const iva = {
        text: '('+elemento.porcentaje+'%)' +' / '+elemento.venta +' /'+ elemento.iva +'\n----------------------------',
        //style: 'subheader',
      };
      this.dd.content.splice(lugarIva, 0, iva);
      lugarIva++;
    });
    
    const escposCommandos = this.convertToEscpos(this.dd);
    

      // alert('Device deviceId:'+ device.device.deviceId); //66:22:D2:A4:9D:6A
      // alert('Device name:'+ device.device.name); // MTP-2
      // alert('Device name:'+ JSON.stringify(device.device)); //uuids: 00001101-0000-1000-8000-00805f9b34fb
      // alert('Device rawAdvertisement:'+  JSON.stringify(device.rawAdvertisement));// object
      // alert('Device rssi:'+ device.rssi);//-39
      // alert('Device txPower:'+ device.txPower);//127
      // alert('Device manufacturerData:'+ JSON.stringify(device.manufacturerData));//object
      // alert('Device serviceData:'+ JSON.stringify(device.serviceData));//object
      // alert('Device uuids:'+ device.uuids);//000018f0-0000-1000-8000-00805f9b34fb,e7810a71-73ae-499d-8c15-faa9aef0c3f2 //bef8d6c9-9c21-4c9e-b632-bd58c1009f9f
      // const escposCommands = [
      //   0x1B, 0x40,        // Inicializa la impresora
      //   0x1B, 0x61, 0x01,  // Alineación al centro
      //   0x48, 0x6F, 0x6C, 0x61, 0x20, 0x6D, 0x75, 0x6E, 0x64, 0x6F, // HOLA MUNDO
      //   // Ejecto de papel
      //   0x1B, 0x64, 0x02,
      
      //   // Corte de papel (opcional, si la impresora soporta)
      //   0x1B, 0x4A, 0x00
      // ];
      this.enviarDatos(device.device.deviceId, 'e7810a71-73ae-499d-8c15-faa9aef0c3f2', 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f', 
      escposCommandos); // Enviar '34' como ejemplo
    
    }, error => {
      alert(error)
    })
  }

  convertToEscpos(dd: any): number[] {
    const commands: number[] = [];
  
    // Inicializa la impresora
    commands.push(0x1B, 0x40); // Resetea la impresora
  
    // Configura alineación
    commands.push(0x1B, 0x61, 0x00); // Alineación a la izquierda
  
    dd.content.forEach((item: any) => {
      // Aplicar estilo de texto
      if(item.style == 'header'){
        commands.push(0x1B, 0x61, 0x01);
        commands.push(0x1B, 0x21, 0x08);
      }else{
        commands.push(0x1B, 0x61, 0x00);
        commands.push(0x1B, 0x21, 0x00);
        // Texto normal
      }
        // Tamaño de texto más pequeño
    //  
      
  
      // Agregar texto
      commands.push(...this.textToEscposBytes(item.text));
  
      // Salto de línea (puedes ajustar el número de saltos según el contenido)
      commands.push(0x0A);
  
    });
  
    // Ejecto de papel (puedes eliminar este comando si prefieres no usarlo)
    //commands.push(0x1B, 0x64, 0x02); // Ejecto de papel
  
    // Corte de papel (opcional)
    //commands.push(0x1B, 0x4A, 0x00); // Corte de papel
  
    return commands;
  }

  
  textToEscposBytes(text: string): number[] {
    // Convertir texto a bytes ASCII
    const asciiBytes = Array.from(text, char => char.charCodeAt(0));
    return asciiBytes;
  }
  

  // Helper function to convert an array of bytes to a DataView
  numbersToDataView(numbers: number[]): DataView {
    const buffer = new ArrayBuffer(numbers.length);
    const view = new DataView(buffer);
    numbers.forEach((num, index) => view.setUint8(index, num));
    return view;
  }

  enviarDatos(deviceId: string, serviceUuid: string, characteristicUuid: string, data: number[]) {
    // Tamaño máximo del fragmento en bytes (ajusta según las especificaciones de la impresora)
    const fragmentSize = 512;
    
    // Función para enviar un fragmento de datos
    const sendFragment = (start: number, end: number): Promise<void> => {
      // Extrae el fragmento de datos
      const fragment = data.slice(start, end);
      const dataView = this.numbersToDataView(fragment);
      
      return BleClient.write(deviceId, serviceUuid, characteristicUuid, dataView)
        .then(() => {
          console.log(`Fragmento enviado: ${start} a ${end - 1}`);
        });
    };
  
    // Enviar todos los fragmentos
    const sendAllFragments = async () => {
      for (let i = 0; i < data.length; i += fragmentSize) {
        const end = Math.min(i + fragmentSize, data.length);
        await sendFragment(i, end);
      }
      
      // Después de enviar todos los fragmentos, muestra un mensaje de éxito
      alert('Todos los datos han sido enviados correctamente.');
       BleClient.disconnect(deviceId);
      // Descarga el PDF si es necesario
      this.pdfServices.downloadPdf(this.dd);
    };
  
    // Manejo de errores global
    sendAllFragments().catch(error => {
      alert('Error al enviar los datos: ' + error);
    });
  }

  async presentarAlerta(header: string, message: string, device?:any, index?:any) {

    const alerta = await this.alertaController.create({
      header: header,
      message: message,
      buttons: 
      [
        {
        text: 'Imprimir',
        role: 'Imprimir',
        handler: async () => {
          this.imprimir(device, index); 
        },
        },
        {
        text: 'Cancelar',
        role: 'Cancelar',
        handler: async () => {},
        },
      ]
    });
    await alerta.present();
  
  }


}
