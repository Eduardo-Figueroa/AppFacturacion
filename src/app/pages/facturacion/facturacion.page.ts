import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FacturacionService } from 'src/app/services/facturacion.service';
import { ModalClientesComponent } from 'src/app/components/modal-clientes/modal-clientes.component';
import { ModalProductosComponent } from 'src/app/components/modal-productos/modal-productos.component';
import { ActivatedRoute } from '@angular/router';
import { ModalEditarProductoComponent } from 'src/app/components/modal-editar-producto/modal-editar-producto.component';
import { ModalDescuentosComponent } from 'src/app/components/modal-descuentos/modal-descuentos.component';
import { ModalPagosComponent } from 'src/app/components/modal-pagos/modal-pagos.component';
import { ModalEditarClienteComponent } from 'src/app/components/modal-editar-cliente/modal-editar-cliente.component';
import { ModalOpcionesComponent } from 'src/app/components/modal-opciones/modal-opciones.component';
import { BluetoothLe } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.page.html',
  styleUrls: ['./facturacion.page.scss'],
})


export class FacturacionPage implements OnInit {

  codigoProforma: any = '';
  Proforma: any = {};
  proformaProductos: any = [];
  Cliente: any = '';
  clienteSeleccionado: any = 'Estimado Cliente';
  proformaTotales: any;
  productoEditado: any;
  mostrarDiv: any;
  cantidad: number = 0;
  mostrar: boolean = false ;
  permisosUsuario: any;
  
  constructor(private facturacionService: FacturacionService,
              private modalController: ModalController,
              private route: ActivatedRoute,
              private toastController: ToastController,
              ) {
              
             }

  ngOnInit() {
    this.permisosUsuario = JSON.parse(localStorage.getItem('PermisosUsuario') || '[]');
    this.route.queryParams.subscribe(params =>{
      this.codigoProforma = params['proforma'];
      this.existeProforma();
    })
    this.existeProforma();
  }

  tienePermiso(permiso: string): boolean {
    return this.permisosUsuario.includes(permiso);
  }
 
  desglose() {
     this.mostrar = ! this.mostrar;   
     document.getElementById('flecha')?.classList.toggle('flecha');
   }


  async abrirModalDescuentos(){
    if(this.Proforma.datos[0].Estado != 2 && this.Proforma.datos[0].Estado != 6){
      const modal = await this.modalController.create({
        component: ModalDescuentosComponent,
        backdropDismiss: false, 
        componentProps: {
          codigoProforma: this.codigoProforma,
          proforma: this.Proforma,
          clienteSeleccionado: this.clienteSeleccionado,
        }
      });

      modal.onDidDismiss().then(() => {
        this.existeProforma();
      });

      return await modal.present();
    }else{
      this.presentarMensaje('No es posible abrir los descuentos', 'middle');
    }
  }

  async abrirModalOpciones() {
      const modal = await this.modalController.create({
        component: ModalOpcionesComponent,
        backdropDismiss: false, 
        componentProps: {
          codigoProforma: this.codigoProforma,
          cliente: this.clienteSeleccionado,
          proforma: this.Proforma,
        }
      });

      modal.onDidDismiss().then(() => {
        this.existeProforma();
    
      });

      await modal.present();

  }
  
  async abrirModalPagos(){
    if(this.Proforma.datos[0].Estado != 2 && this.Proforma.datos[0].Estado != 6){
      const modal = await this.modalController.create({
        component: ModalPagosComponent,
        backdropDismiss: false, 
        componentProps: {
          codigoProforma: this.codigoProforma,
          proforma: this.Proforma,
          clienteSeleccionado: this.clienteSeleccionado,
        }
      });
      modal.onDidDismiss().then(() => {
        this.existeProforma();
      });
      return await modal.present();
    }else{
      this.presentarMensaje('No es posible abrir los pagos', 'middle');
    }
  }

  async abrirModalEditarCliente(){
    if(this.Proforma.datos[0].Estado != 2 && this.Proforma.datos[0].Estado != 6){
      const modal = await this.modalController.create({
        component: ModalEditarClienteComponent,
        backdropDismiss: false, 
        componentProps: {
          codigoProforma: this.codigoProforma,
          proforma: this.Proforma,
          clienteSeleccionado: this.clienteSeleccionado,
        }
      });
      modal.onDidDismiss().then(() => {
        this.existeProforma();
      });
      return await modal.present();
    }else{
      this.presentarMensaje('No es posible abrir el cliente', 'middle');
    }
  }


  async abrirModalClientes() {
    if(this.Proforma.datos[0].Estado != 2 && this.Proforma.datos[0].Estado != 6){
      const modal = await this.modalController.create({
        component: ModalClientesComponent,
        backdropDismiss: false, 
        componentProps: {
          codigoProforma: this.codigoProforma,
          clienteSeleccionado: this.clienteSeleccionado
        }
      });

      modal.onDidDismiss().then((clienteSeleccionado) => {
        //if (clienteSeleccionado.data.clienteSeleccionado != undefined) {
          //this.clienteSeleccionado = clienteSeleccionado.data.clienteSeleccionado;
          this.existeProforma();
        //}else{
          //this.clienteSeleccionado = 'Estimado Cliente';
         // this.existeProforma();
       // }
      });
      return await modal.present();
    }else{
      this.presentarMensaje('No es posible abrir los clientes', 'middle');
    }
  }

  async abrirModalProductos() {
    if(this.Proforma.datos[0].Estado != 2 && this.Proforma.datos[0].Estado != 6){
      const modal = await this.modalController.create({
        component: ModalProductosComponent,
        backdropDismiss: false,   
        componentProps: {
          proforma: this.Proforma,
          clienteSeleccionado: this.clienteSeleccionado,
          codigoProforma: this.codigoProforma,
        }
      });

      modal.onDidDismiss().then(() => {
        this.existeProforma();
      });

      return await modal.present();
    }else{
      this.presentarMensaje('No es posible abrir los productos', 'middle');
    }
  }





  async existeProforma(){
   await this.facturacionService.existeProforma(this.codigoProforma).subscribe(resp => {
      if(resp.code  == 200){
        this.clienteSeleccionado = resp.data.cliente[0];
        localStorage.setItem('ClienteSeleccionado', JSON.stringify(this.clienteSeleccionado));
        this.Proforma = resp.data;
        this.proformaProductos = resp.data.proforma;
        this.proformaTotales = resp.data.totales[0];
        this.cantidad = 0;
        this.proformaProductos.forEach((elemento: any) => {
          const cantidadArticulo = parseFloat(elemento.ArticuloCantidad)
          this.cantidad += cantidadArticulo;
        });

      }else if(resp.code == 400){
        this.facturacionService.nuevaProforma(this.codigoProforma).subscribe(resp =>{
          if(resp.code == 200){
            
            localStorage.setItem('ClienteSeleccionado', JSON.stringify(this.clienteSeleccionado));
            this.existeProforma();
          }
        })
      }

    });
  }

  eliminarProducto(producto: any){
    if(this.Proforma.datos[0].Estado != 2 && this.Proforma.datos[0].Estado != 6){
      this.facturacionService.eliminarProducto(producto, this.codigoProforma).subscribe(resp => {
        if(resp.code == 200){
          this.existeProforma();
        }
      });
    }else{
      this.presentarMensaje('No es posible eliminar', 'middle');
    }
  }

  async editarProducto(producto: any){

    if(this.Proforma.datos[0].Estado != 2 && this.Proforma.datos[0].Estado != 6){
      const modal = await this.modalController.create({
        component: ModalEditarProductoComponent,
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.25, 0.5],
        backdropDismiss: false,   
        componentProps: {
          proformaProductos: this.proformaProductos,
          producto: producto,
          codigoProforma: this.codigoProforma,
          clienteSeleccionado: this.clienteSeleccionado,
        }
      });

      modal.onDidDismiss().then(() => {
        this.existeProforma();
      });
    
      return await modal.present();
    }else{
      this.presentarMensaje('No es posible editar', 'middle');
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
