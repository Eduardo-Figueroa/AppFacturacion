import { Injectable } from '@angular/core';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Platform } from '@ionic/angular';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

import * as pdfMake from 'pdfmake/build/pdfmake'; // Importa usando '*'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; // Importa las fuentes

// Asigna las fuentes a pdfMake
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs; // Usar as any para evitar problemas de tipos


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  pdfObj: any;

  constructor(private platform: Platform,
              private fileOpener: FileOpener,
              private bluetoothSerial: BluetoothSerial
  ) { }

  async createPDF(dd:any){
    try {
      var docObj = dd;
      this.pdfObj = pdfMake.createPdf(docObj);
    } catch (error) {
      
    }
  }

  downloadPdf(dd: any){
    this.createPDF(dd);
   if(this.platform.is('cordova')){
      this.pdfObj.getBase64(async (data:any) => {
        try{
          let path = `pdf/prueba_${Date.now()}.pdf`;
          const result = await Filesystem.writeFile({
            path,
            data,
            directory: Directory.Documents,
            recursive: true,
          });
          this.fileOpener.open(`${result.uri}`, 'application/pdf');
        }catch(e){
          alert('error '+e)
        }
      })
   }else{
    this.pdfObj.download();
   }
   
    }


    generatePDF() {
      const dd = {
        content: [
          {
            text: 'DEMO TIENDA (EMPRESA DE PRUEBA)',
            style: 'header'
          },
          // ... el resto de tu contenido PDF
        ],
        styles: {
          header: {
            fontSize: 35,
            bold: true
          },
          subheader: {
            fontSize: 30,
            bold: false
          },
        }
      };
  
      return new Promise((resolve, reject) => {
        pdfMake.createPdf(dd).getBase64((data) => {
          resolve(data);
        });
      });
    }
  
    base64ToArrayBuffer(base64: string): ArrayBuffer {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }

    async print(id: any) {
      try {
        const base64PDF = await this.generatePDF();
        const testData = new Uint8Array([72, 101, 108, 108, 111]);
        const pdfData = `data:application/pdf;base64,${base64PDF}`;
        
        // Conectar con la impresora Bluetooth
        this.bluetoothSerial.isEnabled().then(() => {
          
            // Enviar PDF a la impresora
            this.bluetoothSerial.write(pdfData).then(() => {
              alert('PDF enviado a la impresora.' + pdfData);
            }).catch(error => {
              alert('Error al enviar PDF:'+ error);
            });

        }).catch(error => {
          alert('Bluetooth no está habilitado:'+ error);
        });
  
      } catch (error) {
        alert('Error en la impresión:'+ error);
      }
    }
  }
  

