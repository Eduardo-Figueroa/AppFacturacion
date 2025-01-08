import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  Perfil: any;
  Cliente: any;
  APIBase: string = 'https://invefacon.com/api/';

  constructor(private http: HttpClient) { }

    //Obtiene el usuario logueado del LocalStorage
    obtenerUsuario(){
      const perfilStr = localStorage.getItem('Usuario');
      let perfil: {} = {};
      if (perfilStr) {
        this.Perfil = JSON.parse(perfilStr);
      }
      return this.Perfil;
    }

    obtenerCliente(){
      const clienteStr = localStorage.getItem('ClienteSeleccionado');
      if (clienteStr) {
        this.Cliente = JSON.parse(clienteStr);
      }
    }

    obtenerProductos(tipoMoneda: any, tipoprecio: any, codigo?:any){

      this.obtenerUsuario();

      let headers = new HttpHeaders({
        'Authorization': `Bearer ${this.Perfil.Token}` 
      });
  
      let options = { headers: headers };
      let body;
      const formdata = new FormData();
      
      if(codigo){
        body = {
          'moneda': tipoMoneda,
          'tipoPrecio': tipoprecio,
          'codigo': codigo
        };
       
        formdata.append('moneda', tipoMoneda);
        formdata.append('tipoPrecio', tipoprecio);
        formdata.append('codigo', codigo);
      }else{
        body = {
          'moneda': tipoMoneda,
          'tipoPrecio': tipoprecio
        };
       
        formdata.append('moneda', tipoMoneda);
        formdata.append('tipoPrecio', tipoprecio);
      }
     let resp = this.http.post(`${this.APIBase}facturacion/articulosfacturar.php`,  formdata || body, options).pipe(tap((resp:any) =>{}));
    
     return resp;
    }

    guardarLineaProforma(codigoProforma:any, producto: any, lineaId?: any){

      this.obtenerUsuario();
      this.obtenerCliente();

      let headers = new HttpHeaders({
        'Authorization': `Bearer ${this.Perfil.Token}` 
      });
  
      let options = { headers: headers };

      const formdata = new FormData();

      if(lineaId){
        formdata.append('articuloLineaId', lineaId);
        formdata.append('numero', codigoProforma);
        formdata.append('tipoDocumento', '01');
        formdata.append('articuloCodigo', producto.ArticuloCodigo);
        formdata.append('articuloCabys', producto.Cod_Cabys);
        formdata.append('articuloTipoPrecio', '1');
        formdata.append('articuloActividadEconomica', producto.Actividad_Economica);
        formdata.append('articuloCantidad', producto.cantidad);
        formdata.append('articuloUnidadMedida', producto.Unidad_Medida);
        formdata.append('presentacion', 'item');
        formdata.append('articuloBodegaCodigo', producto.opcionBodega);
        formdata.append('articuloCosto', producto.Costo); //COsto
        formdata.append('articuloVenta', producto.opcionPrecio);
        formdata.append('articuloVentaSubTotal1',producto.opcionPrecio);
        formdata.append('articuloDescuentoPorcentage', producto.descuento);
        formdata.append('articuloVentaSubTotal2', producto.opcionPrecio);
        formdata.append('articuloOtrosCargos', '0');
        formdata.append('articuloVentaSubTotal3', producto.opcionPrecio);
        formdata.append('articuloIvaPorcentage', producto.Impuesto);
        formdata.append('articuloIvaExonerado', '0');
        formdata.append('articuloIvaMonto', (producto.total*producto.Impuesto/100).toString());
        formdata.append('articuloIvaDevuelto', '0');
        formdata.append('articuloVentaGravado',  producto.opcionPrecio);
        formdata.append('articuloVentaExonerado','0');
        formdata.append('articuloVentaExento', '0');
        formdata.append('articuloVentaTotal', producto.total);
        formdata.append('idCliente', this.Cliente.codigo || this.Cliente.ClienteID);
      }else{
        formdata.append('numero', codigoProforma);
        formdata.append('tipoDocumento', '01');
        formdata.append('articuloCodigo', producto.Codigo);
        formdata.append('articuloCabys', producto.Cod_Cabys);
        formdata.append('articuloTipoPrecio', '1');
        formdata.append('articuloActividadEconomica', producto.Actividad_Economica);
        formdata.append('articuloCantidad', producto.cantidad);
        formdata.append('articuloUnidadMedida', producto.Unidad_Medida);
        formdata.append('presentacion', 'item');
        formdata.append('articuloBodegaCodigo', producto.opcionBodega);
        formdata.append('articuloCosto', producto.Costo);
        formdata.append('articuloVenta', producto.opcionPrecio);
        formdata.append('articuloVentaSubTotal1',producto.total);
        formdata.append('articuloDescuentoPorcentage', producto.descuento);
        formdata.append('articuloVentaSubTotal2', producto.total);
        formdata.append('articuloOtrosCargos', '0');
        formdata.append('articuloVentaSubTotal3', producto.total);
        formdata.append('articuloIvaPorcentage', producto.Impuesto);
        formdata.append('articuloIvaExonerado', '0');
        formdata.append('articuloIvaMonto', (producto.total*producto.Impuesto/100).toString());
        formdata.append('articuloIvaDevuelto', '0');
        formdata.append('articuloVentaGravado',  producto.total);
        formdata.append('articuloVentaExonerado','0');
        formdata.append('articuloVentaExento', '0');
        formdata.append('articuloVentaTotal', producto.total);
        formdata.append('idCliente', this.Cliente.codigo || this.Cliente.ClienteID);
      }     
     


      let resp = this.http.post(`${this.APIBase}facturacion/agregaactualizalineaproforma.php`,formdata, options).pipe(tap((resp:any) =>{}));

      return resp;
    }

}
