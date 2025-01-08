import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  Perfil: any;
  Cliente: any;
  APIBase: string = 'https://invefacon.com/api/';

  constructor( private http: HttpClient) { }

  //Obtiene el usuario logueado del LocalStorage
  obtenerUsuario(){
    const perfilStr = localStorage.getItem('Usuario');
    let perfil: {} = {};
    if (perfilStr) {
      this.Perfil = JSON.parse(perfilStr);
    }
    return this.Perfil;
  }

  obtenerClientes(){

    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };

    
   let resp = this.http.post(`${this.APIBase}clientes/clientes.php`, {}, options).pipe(tap((resp:any) =>{}));
  
   return resp;

  } 

  existeProforma(codigoProforma: any){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };

    const formdata = new FormData();
    formdata.append('numerodocumento', codigoProforma);


    let resp = this.http.post(`${this.APIBase}facturacion/AbrirProforma.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
    return resp;
  }

  nuevaProforma(codigoProforma: any){
   
    this.obtenerUsuario();
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };

    const formdata = new FormData();
    formdata.append('numero', codigoProforma);


    let resp = this.http.post(`${this.APIBase}facturacion/NuevaProforma.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
    return resp;
  }

  actualizarCliente(codigoProforma: any){

    this.obtenerUsuario();
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };

    this.Cliente = localStorage.getItem('ClienteSeleccionado');
    this.Cliente = JSON.parse(this.Cliente);
    

    const formdata = new FormData();
    formdata.append('numero', codigoProforma);
    formdata.append('clienteid', this.Cliente.clienteID || this.Cliente.codigo);
    formdata.append('clientenombre', this.Cliente.clientenombrecomercial || this.Cliente.nombrecomercial);
    formdata.append('monedacodigo', this.Cliente.monedacodigo || this.Cliente.moneda);
    formdata.append('tipoprecioventa', this.Cliente.TipoPrecioVenta || this.Cliente.tipoprecio);


    let resp = this.http.post(`${this.APIBase}facturacion/cambiaclienteproforma.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
    return resp;
  }

  eliminarProducto(producto: any, codigoProforma: any){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };


    const formdata = new FormData();
    formdata.append('Numero', codigoProforma);
    formdata.append('ArticuloLineaId', producto.ArticuloLineaId);

    let resp = this.http.post(`${this.APIBase}facturacion/eliminarlineaproformahija.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
    return resp;
  }

  monedas(){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };


    const formdata = new FormData();

    let resp = this.http.post(`${this.APIBase}varios/tipomoneda.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
    return resp;
  }

  metodosPago(){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };


    const formdata = new FormData();

    let resp = this.http.post(`${this.APIBase}varios/cuentasmediopago.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
    return resp;
  }

  guardarProforma(codigoProforma: any, tipo:any){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };


    const formdata = new FormData();
    formdata.append('proforma', codigoProforma);
    formdata.append('tipo', tipo)

    let resp = this.http.post(`${this.APIBase}facturacion/guardarproforma.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
    return resp;
  }
}
