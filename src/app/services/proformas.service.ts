import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProformasService {

  Perfil: any;
  Cliente: any;
  APIBase: string = 'https://invefacon.com/api/';

  constructor(private http: HttpClient) { }


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

  obtenerProformas(fechaInicial: any, fechaFinal: any, clienteCodigo?: any, usuarioCodigo?:any, monto?: any, Agente?: any, cliente?: any, tipo?:any){

    this.obtenerUsuario();



      let headers = new HttpHeaders({
        'Authorization': `Bearer ${this.Perfil.Token}` 
      });
  
      let options = { headers: headers };
      let body;
      const formdata = new FormData();

        formdata.append('fechainicial', fechaInicial);
        formdata.append('fechafinal', fechaFinal);
        formdata.append('usuariocodigo', usuarioCodigo || '');
        formdata.append('clienteid', clienteCodigo || '');
        formdata.append('clientenombre', cliente || '');
        formdata.append('tipo', tipo || '');
        formdata.append('monto', monto || '');
        formdata.append('agentecodigo', Agente || '');

         body ={
          'fechainicial': fechaInicial,
          'fechafinal': fechaFinal,
          'usuariocodigo': clienteCodigo,
          'clientenombre': cliente,
          'tipo': tipo,
          'monto': monto,
          'agentecodigo': Agente
         };

      
     let resp = this.http.post(`${this.APIBase}facturacion/consultarproformas.php`, formdata || body, options).pipe(tap((resp:any) =>{}));
    
     return resp;
  }

  aplicarDescuentos(codigoProforma: any, productosDescuento: any){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };
    let body;
    const formdata = new FormData();

      formdata.append('proforma', codigoProforma);
      formdata.append('lineas', productosDescuento);
     
    
   let resp = this.http.post(`${this.APIBase}facturacion/actualizadescuento.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
   return resp;
  }

  limpiarProforma(codigoProforma: any){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };
    let body;
    const formdata = new FormData();

      formdata.append('Numero', codigoProforma);
     
    
   let resp = this.http.post(`${this.APIBase}facturacion/limpiarlineasproformahija.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
   return resp;
  }

  exonerarFactura(codigoProforma: any, clienteId: any){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };
    let body;
    const formdata = new FormData();

      formdata.append('Numero', codigoProforma);
      formdata.append('ClienteId', clienteId);
    
   let resp = this.http.post(`${this.APIBase}facturacion/exonerarfactura.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
   return resp;
  }

  quitarExonerarFactura(codigoProforma: any){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };
    let body;
    const formdata = new FormData();

      formdata.append('Numero', codigoProforma);
    
   let resp = this.http.post(`${this.APIBase}facturacion/quitaexoneracionfactura.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
   return resp;
  }

  facturarACosto(codigoProforma: any){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };
    let body;
    const formdata = new FormData();

      formdata.append('Numero', codigoProforma);
    
   let resp = this.http.post(`${this.APIBase}facturacion/facturaracosto.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
   return resp;
  }

  editarCliente(id_Cliente:any, cedula:any, tipoIdentificacion:any, nombreCliente:any, nombreComercial:any, telefono:any, email:any, tipoPrecio:any, moneda:any, direccion:any ){
    // si es sn no puede y tiene que tener 311
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };
    let body;
    const formdata = new FormData();

    formdata.append('Id_Cliente', id_Cliente);
    formdata.append('Cedula', cedula);
    formdata.append('Nombre', nombreCliente);
    formdata.append('TipoIdentificacion', tipoIdentificacion);
    formdata.append('Telefonos', telefono );
    formdata.append('Direccion',direccion);
    formdata.append('TipoPrecioVenta', tipoPrecio);
    formdata.append('Email', email);
    formdata.append('Cod_Moneda', moneda);
    formdata.append('ClienteNombreComercial', nombreComercial);
    formdata.append('EmailFactura', email);



   let resp = this.http.post(`${this.APIBase}clientes/editarcliente.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
   return resp;
  }

  editarClienteProforma(codigoProforma:any, id_Cliente:any, nombreCliente:any, tipoPrecio:any, moneda:any ){
    // si es sn no puede y tiene que tener 311
    this.obtenerUsuario();
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };


    const formdata = new FormData();
    formdata.append('numero', codigoProforma);
    formdata.append('clienteid', id_Cliente);
    formdata.append('clientenombre', nombreCliente);
    formdata.append('monedacodigo', moneda);
    formdata.append('tipoprecioventa', tipoPrecio);


    let resp = this.http.post(`${this.APIBase}facturacion/cambiaclienteproforma.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
    return resp;
  }

  obtenerIva(){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };

    const formdata = new FormData();

      
   let resp = this.http.post(`${this.APIBase}varios/tipotarifaimpuesto.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
   return resp;
  }

  aplicarIva(documento:any, CodTarifaImpuesto: any, Lineas:any){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };
    const formdata = new FormData();

    formdata.append('Numero', documento);
    formdata.append('CodTarifaImpuesto', CodTarifaImpuesto);
    formdata.append('Lineas', Lineas);

      
   let resp = this.http.post(`${this.APIBase}facturacion/aplicaivadiferente.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
   return resp;
  }

}
