import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-modal-editar-producto',
  templateUrl: './modal-editar-producto.component.html',
  styleUrls: ['./modal-editar-producto.component.scss'],
})
export class ModalEditarProductoComponent  implements OnInit {

  @Input() producto: any;
  @Input() codigoProforma: any;
  Cliente: any;
  productoEditado: any;
  cantidadEditada: any;
  descuentoEditado: any;
  Bodegas: any = [];
  opcionBodega: any; 
  opcionPrecio: any;
  totales: any;
  carrito: any;


  constructor(private modalController: ModalController,
              private productosService: ProductosService,
              private alertaController: AlertController,
              private toastController: ToastController
            ) { }

  ngOnInit() {
    this.obtenerCliente();
    this.obtenerProductos();
  }

  cancelar() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirmar() {
    this.agregarProductos(this.productoEditado,  this.cantidadEditada, this.opcionPrecio, this.opcionBodega, this.descuentoEditado);   
  }

  obtenerCliente(){
    const clienteStr = localStorage.getItem('ClienteSeleccionado');
    if (clienteStr) {
      this.Cliente = JSON.parse(clienteStr);
    }
  }


  obtenerProductos(){
    this.productosService.obtenerProductos((this.Cliente.moneda || this.Cliente.monedacodigo), (this.Cliente.tipoprecio || this.Cliente.TipoPrecioVenta), (this.producto.ArticuloCodigo)).subscribe(resp => { 
      if(resp.code  == 200){ 
        this.productoEditado = resp.data[0];
        let articuloBodegas = this.productoEditado.bodegas.replace(/\\/g, '');
          this.Bodegas.push(JSON.parse(articuloBodegas));
          this.productoEditado.bodegas = this.Bodegas[0];
          this.productoEditado.Precios = [ 
            (this.productoEditado.Precio1), (this.productoEditado.Precio2),
            (this.productoEditado.Precio3), (this.productoEditado.Precio4), 
            (this.productoEditado.Precio5), (this.productoEditado.Precio6), 
            (this.productoEditado.Precio7), (this.productoEditado.Precio8),
            (this.productoEditado.Precio9), (this.productoEditado.Precio10)
          ];
          for (let i = 0; i < this.productoEditado.Precios.length; i++) {
            if (!isNaN(this.productoEditado.Precios[i])) {
              this.productoEditado.Precios[i] = Number(this.productoEditado.Precios[i]).toFixed(2);
            }
          }

        this.productoEditado = Object.assign({}, this.producto, this.productoEditado);
        this.productoEditado.bodegas.forEach((bodega: any)=>{
          if(bodega.Cod_Bodega == this.productoEditado.ArticuloBodegaCodigo){
           this.opcionBodega = { bodega: bodega.Cod_Bodega, bodegaDesc: bodega.Descripcion }
          }
        });
        this.cantidadEditada = this.productoEditado.ArticuloCantidad;
        this.descuentoEditado = this.productoEditado.ArticuloDescuentoPorcentage;
        this.opcionPrecio = this.productoEditado.PrecioUd;
      }});
  }


  agregarProductos(producto: any, cantidad: any, opcionPrecio: any,  opcionBodega: any, descuento?: any){
    
    if(((cantidad == undefined || cantidad =='' ||cantidad == 0) || opcionBodega == undefined || opcionPrecio == undefined || descuento > 100)){
       this.presentarAlerta('Valores incorrectos', 'middle'
        )
    }else{
      producto['cantidad'] = cantidad;
      producto['opcionPrecio'] = opcionPrecio.precio ? opcionPrecio.precio : opcionPrecio //parseFloat(this.producto.ArticuloCosto + (this.producto.ArticuloCosto * this.producto.ArticuloIvaPorcentage/100));
      producto['opcionBodega'] = opcionBodega.bodega != undefined ? opcionBodega.bodega : opcionBodega;
      producto['descuento'] =  descuento ? descuento : this.Cliente.Descuento;
      producto['total'] = cantidad*opcionPrecio.precio || cantidad*producto['opcionPrecio'];
  
      this.productoEditado = producto;
  
    this.productosService.guardarLineaProforma(this.codigoProforma, this.productoEditado, this.producto.ArticuloLineaId).subscribe(async (respu) => {
        if(respu.code == 200){
          
          if(respu.data.respuestas.length > 0){
            let mensajeErrores = respu.data.respuestas[0];
            this.descuentoAlerta('Descuento parcial', mensajeErrores);
            this.cerrarModalEditar(); 
          }else{
            this.presentarAlerta('Producto actualizado', 
              'middle'
              );
            this.cerrarModalEditar();    
          }
           
      
                        
        }
     });
    
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

  async descuentoAlerta(header: string, message: string) {
    const alerta = await this.alertaController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
    });

    await alerta.present();
  }

  cerrarModalEditar(){
    this.modalController.dismiss({
     productoEditado: this.productoEditado
    });
  }
}
