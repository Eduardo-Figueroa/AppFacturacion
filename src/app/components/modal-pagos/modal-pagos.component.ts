import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FacturacionService } from 'src/app/services/facturacion.service';
import { PagosService } from 'src/app/services/pagos.service';

@Component({
  selector: 'app-modal-pagos',
  templateUrl: './modal-pagos.component.html',
  styleUrls: ['./modal-pagos.component.scss'],
})
export class ModalPagosComponent  implements OnInit {

  @Input() proforma: any;
  @Input() codigoProforma: any;
  metodoPago: any = [];
  metodoPagoFinal: any = [];
  monedas: any;
  metodos: any;
  total: any;
  vuelto:any;
  pago:any;
  codigoMetodo: any;
  tipoCambio: any


  constructor(private modalController: ModalController,
              private facturacionService: FacturacionService,
              private toastController: ToastController,
              private pagosSevice: PagosService,
              ) { }

  ngOnInit(): void {
    this.total = this.proforma.totales[0].Total;
    this.vuelto = this.proforma.totales[0].Vuelto;
    this.pago = this.proforma.totales[0].Pago;
    this.obtenerMonedas();
    this.obtenerMetodos();
    this.pagosSevice.getTipoCambio().subscribe((resp)=>{
      this.tipoCambio = resp;
    });

  }

  obtenerPagosGuardados(){
    if(this.proforma.pagos.length > 0){
      this.proforma.pagos.forEach((elemento: any) => {
        this.metodos.forEach((metodo :any)=>{
          if(elemento.CuentaContable == metodo.Cuenta){
            this.metodoPago.push({ id: elemento.Id, metodo: this.metodos, moneda: this.monedas, metodoSeleccionado: metodo.Nombre, monedaSeleccionada: elemento.CodigoMoneda, monto: elemento.Monto});
            this.metodoPagoFinal = [...this.metodoPago];
          }
        })
      });
    }
  }

  async obtenerMonedas() {
     await this.facturacionService.monedas().subscribe((resp)=>{
      if(resp.code == 200){
        resp.data;
        this.monedas = Object.values(resp.data).map((item: any) => ({
          codigo: item.codigo,
          nombre: item.nombre,
          signo: item.signo
        }));
      }
    });
  }

  monto(){
    this.pago = this.metodoPago.reduce((acc: any, campo: any) => {
      if(campo.monedaSeleccionada == 'USD'){
        return acc + (parseFloat(campo.monto)*this.tipoCambio.compra || 0);
      }else if(campo.monedaSeleccionada == 'EUR'){
        return acc + (parseFloat(campo.monto)*this.tipoCambio.euro*this.tipoCambio.compra || 0);
      }
      return acc + (parseFloat(campo.monto) || 0);
    }, 0);
    this.vuelto = -this.total + this.pago;
  }


  async obtenerMetodos() {
    await this.facturacionService.metodosPago().subscribe((resp)=>{
     if(resp.code == 200){
       this.metodos = resp.data;
       this.obtenerPagosGuardados();
     }
   });
 }


  cerrarModalPagos() {
    this.modalController.dismiss();
  }

  agregarCampos(){
    if(this.metodoPago.length < 1){
      this.metodoPago.push({id: '0', metodo: this.metodos, moneda: this.monedas, metodoSeleccionado: 'efectivo', monedaSeleccionada: 'CRC', monto: this.total});
      this.metodoPagoFinal = [...this.metodoPago];
      this.vuelto = 0;
      this.pago = this.total;
    }else{
    this.metodoPago.push({id: '0', metodo: this.metodos, moneda: this.monedas, metodoSeleccionado: 'efectivo', monedaSeleccionada: 'CRC', monto: 0});
    this.metodoPagoFinal = [...this.metodoPago];
    }
  }

  eliminarMetodo(index: number, id:any){
    if(this.metodoPago.length > 0){
      this.metodoPago.splice(index, 1);
      const elemento = this.metodoPagoFinal.find((e:any)=>e.id == id);  
      elemento.monto = 'eliminar';
      //this.metodoPagoFinal[index].monto = 'eliminar';
      this.monto();
    }
  } 

  guardarMetodos(){
    if(this.metodoPagoFinal.length > 0){
      this.metodoPago = this.metodoPagoFinal.filter((e: any) => parseFloat(e.monto) > 0);
      this.metodoPagoFinal.forEach((elemento:any, i: any) => {
          elemento.metodo.forEach((e:any) => {
            if(e.Nombre == this.metodoPagoFinal[i].metodoSeleccionado){
              this.metodoPagoFinal[i].metodoCodigo = e.Cuenta
            }
            if(this.metodoPagoFinal[i].monedaSeleccionada == 'CRC'){
              this.metodoPagoFinal[i].tipoCambio = 1;
            }  else if(this.metodoPagoFinal[i].monedaSeleccionada == 'USD'){
              this.metodoPagoFinal[i].tipoCambio = this.tipoCambio.compra;
            } else if(this.metodoPagoFinal[i].monedaSeleccionada == 'EUR'){
              this.metodoPagoFinal[i].tipoCambio = this.tipoCambio.euro*this.tipoCambio.compra
            }  
        });
        this.pagosSevice.guardarMedioPago(this.codigoProforma, this.metodoPagoFinal[i].id, this.metodoPagoFinal[i].metodoCodigo, this.metodoPagoFinal[i].monedaSeleccionada, this.metodoPagoFinal[i].monto, this.metodoPagoFinal[i].tipoCambio).subscribe((resp)=>{
          if(resp.code == 200){
            this.presentarMensaje('Se agregaron exitosamente', 'middle')
          }
        });     
    });
     this.cerrarModalPagos();
    }else{
      this.presentarMensaje('Agregue metodos de pago', 'middle')
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
  

}
