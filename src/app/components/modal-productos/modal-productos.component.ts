import { Component, Input, OnInit } from '@angular/core';
import {  ModalController, ToastController } from '@ionic/angular';
import { FacturacionService } from 'src/app/services/facturacion.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-modal-productos',
  templateUrl: './modal-productos.component.html',
  styleUrls: ['./modal-productos.component.scss'],

})
export class ModalProductosComponent  implements OnInit {

  @Input() codigoProforma: any;

  Productos: any; 
  busquedaProducto: any = [];
  ProductosFiltados: any = [];
  Bodegas: any = [];
  Precios: any  = [];
  precioSeleccionado: any;
  Pagina:number = 0;
  productoSeleccionado: any;
  Cliente: any;
  opcionBodega: any;
  opcionPrecio: any;
  carrito: any = [];
  totales: any;
  
  constructor(private modalController: ModalController,
              private facturacionService: FacturacionService,
              private productosService: ProductosService,
              private toastController: ToastController
            ) {}

  ngOnInit() {

    this.obtenerCliente();
    this.obtenerProductos();
    this.precioSeleccionado = 0;
  }

  obtenerCliente(){
    const clienteStr = localStorage.getItem('ClienteSeleccionado');
    if (clienteStr) {
      this.Cliente = JSON.parse(clienteStr);
    }
  }

  obtenerProductos(){

    this.productosService.obtenerProductos((this.Cliente.moneda || this.Cliente.monedacodigo), (this.Cliente.tipoprecio || this.Cliente.TipoPrecioVenta)).subscribe(resp => { 
      if(resp.code  == 200){   
        this.Productos = resp.data;
        this.Productos.forEach((articulo:any, index:number) => {
          let articuloBodegas = articulo.bodegas.replace(/\\/g, '');
          this.Bodegas.push(JSON.parse(articuloBodegas));
          this.Productos[index].bodegas = this.Bodegas[index];
          if((this.Cliente.Descuento || this.Cliente.descuento) == 0){
            this.Productos[index].descuento = articulo.Descuento_Fijo;
          }else{
            this.Productos[index].descuento = this.Cliente.Descuento || this.Cliente.descuento;
          }
         
          this.Productos[index].Precios = [ 
          (this.Productos[index].Precio1), (this.Productos[index].Precio2),
          (this.Productos[index].Precio3), (this.Productos[index].Precio4), 
          (this.Productos[index].Precio5), (this.Productos[index].Precio6), 
          (this.Productos[index].Precio7), (this.Productos[index].Precio8),
          (this.Productos[index].Precio9), (this.Productos[index].Precio10)
        ];
        for (let i = 0; i < this.Productos[index].Precios.length; i++) {
          if (!isNaN(this.Productos[index].Precios[i])) {
            this.Productos[index].Precios[i] = Number(this.Productos[index].Precios[i]).toFixed(2);
          }
        }
        });
        
        this.ProductosFiltados = this.Productos;
        
        this.cargarPagina();
      }
    });
  }


  cargarPagina(){
    let cantidadPagina = 20;
    let inicio = this.Pagina;
    if(inicio != 0){
      inicio += cantidadPagina;
    }
    let final = inicio + cantidadPagina;
    if(this.Pagina == 0){
      this.busquedaProducto = this.ProductosFiltados.slice(inicio,final);
    }else{ 
      this.busquedaProducto = this.busquedaProducto.concat(this.ProductosFiltados.slice(inicio,final));
    }
    
    this.Pagina++;
  }

  cargarScroll(event: any) {
    
      if(this.busquedaProducto.length != this.Productos.length){
        this.cargarPagina();
      }
      event.target.complete();
  }

  cerrarModalProductos() {
    this.modalController.dismiss({
      productosSeleccionado: this.carrito,
      totales: this.totales,
    });
  }


  buscarProducto( event: any){
    const texto = event.target.value;

    if(texto && texto.trim() != ''){
      this.ProductosFiltados = this.Productos.filter((producto: any)=>{
        return (
          producto.Descripcion.toLowerCase().indexOf(texto.toLowerCase())>-1 ||
          producto.Codigo.toLowerCase().includes(texto.toLowerCase()) ||
          producto.Cod_Barra.toLowerCase().includes(texto.toLowerCase())
         );
      });
    }
    this.Pagina = 0;
    this.cargarPagina();
  }


  precio(event: any) {
    this.precioSeleccionado = event.target.value;
    this.precioSeleccionado.precio =Math.ceil(parseFloat(this.precioSeleccionado.precio)).toFixed(2); //Math.ceil(parseFloat(event.target.value)).toFixed(2);
  }

  agregarProductos(producto: any, cantidad: any, opcionPrecio: any,  opcionBodega: any, descuento?: any){
    if(opcionPrecio == undefined){
      opcionPrecio = { precio: producto.Precio1, index: 0}
    }
    if(opcionBodega == undefined){
      opcionBodega = { bodega: producto.bodegas[0].Cod_Bodega, bodegaDesc: producto.bodegas[0].Descripcion, index: 0 }
    }
    if(((cantidad == undefined || cantidad =='' ||cantidad == 0 || cantidad < 0)  || (descuento < 0 || descuento > 100))){
      this.presentarAlerta('Valores incorrectos',
        'middle'
      )
    }else{
      producto['cantidad'] = cantidad;
      producto['opcionPrecio'] = opcionPrecio.precio;
      producto['opcionBodega'] = opcionBodega.bodega;
      producto['descuento'] = descuento ? descuento : this.Cliente.Descuento;
      producto['total'] = cantidad*opcionPrecio.precio;
  
      this.productoSeleccionado = producto;

      this.productosService.guardarLineaProforma(this.codigoProforma, this.productoSeleccionado).subscribe((resp) => {
        if(resp.code == 200){
          this.cargarProductoProforma();
          this.presentarAlerta('Producto agregado', 
                                'middle'
                              );
        }
      });
      
    }
  }

  cargarProductoProforma(){
    this.facturacionService.existeProforma(this.codigoProforma).subscribe((resp)=>{
      if(resp.code == 200){
        this.totales = resp.data.totales;
        this.carrito = resp.data.proforma;
      }
    });
  }

  async presentarAlerta(message: string, position: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: position,
    });

    await toast.present();
  }
  // async presentarAlerta(header: string, message: string) {
  //   const alerta = await this.alertaController.create({
  //     header: header,
  //     message: message,
  //     buttons: ['Aceptar'],
  //   });

  //   await alerta.present();
  // }

}
