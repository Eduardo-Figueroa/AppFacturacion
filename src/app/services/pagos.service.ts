import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PagosService {

  private readonly indEconomWs = 'https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicos';
  private readonly nombre = 'invefacon';
  private readonly email = 'rreyes2005g@gmail.com'; // Correo electrónico
  private readonly tokenBCCR = 'LITPIM2M2I'; // Token
  Perfil: any;
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
    
  getTipoCambio() {
    const fecha = new Date();
    const day = String(fecha.getDate()).padStart(2, '0');
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 (enero) a 11 (diciembre)
    const year = fecha.getFullYear();

    const fechaHoy = `${day}/${month}/${year}`;
    const compra = 317;
    const venta = 318;
    const euro = 333;

    const urlWS_c = `${this.indEconomWs}?Indicador=${compra}&FechaInicio=${fechaHoy}&FechaFinal=${fechaHoy}&Nombre=${this.nombre}&SubNiveles=N&CorreoElectronico=${this.email}&Token=${this.tokenBCCR}`;
    const urlWS_v = `${this.indEconomWs}?Indicador=${venta}&FechaInicio=${fechaHoy}&FechaFinal=${fechaHoy}&Nombre=${this.nombre}&SubNiveles=N&CorreoElectronico=${this.email}&Token=${this.tokenBCCR}`;
    const urlWS_e = `${this.indEconomWs}?Indicador=${euro}&FechaInicio=${fechaHoy}&FechaFinal=${fechaHoy}&Nombre=${this.nombre}&SubNiveles=N&CorreoElectronico=${this.email}&Token=${this.tokenBCCR}`;
    return this.peticionTipoCambio(urlWS_c, urlWS_v, urlWS_e);
  }

  private peticionTipoCambio(urlWS_c: string, urlWS_v: string, urlWS_e: string) {

   return forkJoin({
      compra: this.http.get(urlWS_c, { responseType: 'text' }).pipe(map(response => this.xml(response, 'NUM_VALOR'))),
      venta: this.http.get(urlWS_v, { responseType: 'text' }).pipe(map(response => this.xml(response, 'NUM_VALOR'))),
      euro: this.http.get(urlWS_e, { responseType: 'text' }).pipe(map(response => this.xml(response, 'NUM_VALOR')))
    }).pipe(
      catchError(() => of({ compra: '0', venta: '0', euro: '0' })) // Si hay error los manda en cero
    );
  }

  private xml(xml: string, etiqueta: string): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const value = xmlDoc.getElementsByTagName(etiqueta)[0]?.textContent || '0';
    return value.slice(0, -6); 
  }

  guardarMedioPago(documento: any, id: any, cuentaContable: any, codigoMoneda: any, monto:any, tipoCambio: any){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };


    const formdata = new FormData();
    formdata.append('id', id );
    formdata.append('documento', documento);
    formdata.append('cuentaContable', cuentaContable);
    formdata.append('codigoMoneda', codigoMoneda);
    formdata.append('monto', monto);
    formdata.append('tipoCambio', tipoCambio);
    formdata.append('tipoDocumento', '01');

    let resp = this.http.post(`${this.APIBase}facturacion/documentomediopago.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
    return resp;
  }

}
