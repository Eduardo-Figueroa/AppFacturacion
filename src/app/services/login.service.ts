import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators'
import { NewResponse, permisosUsuario } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

 
  constructor(private http: HttpClient) { }

  Perfil: any;
  APIBase: string = 'https://invefacon.com/api/';

  //Obtiene el usuario logueado del LocalStorage
  obtenerUsuario(){
    const perfilStr = localStorage.getItem('Usuario');
    let perfil: {} = {};
    if (perfilStr) {
      this.Perfil = JSON.parse(perfilStr);
    }
    return this.Perfil;
  }

  //Obtiene las empresas para el select de logueo
  obtenerEmpresas(correo: any){
    let headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJDb2RpZ28iOiIwMDAwNiIsIk5vbWJyZSI6IlJPQkVSVE8tQURNSU4iLCJFbWFpbCI6InJyZXllc0Bzb3BvcnRlcmVhbC5jb20iLCJFbXByZXNhIjoiWkdWdGIyWmxjbkpsIiwiU2VydmVySXAiOiJNVGt5TGpFMk9DNDNMak00IiwidGltZSI6IjIwMjQwNTA4MDUwNTAwIn0.xhtue1k1mlhVk_zHgE_2snQ4wBZuGngo79j_tR-wbOU' 
    });

    let options = { headers: headers};
    const formdata = new FormData();
    formdata.append("email", correo);

    return this.http.post<NewResponse>(`${this.APIBase}seguridad/empresas.php`, formdata, options).pipe(tap(resp => resp));
  }

  // Realiza la validacion con la BD para loguearse
  login(correo: any, empresa: any, password: any):Observable<NewResponse>{
    let headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJDb2RpZ28iOiIwMDAwNiIsIk5vbWJyZSI6IlJPQkVSVE8tQURNSU4iLCJFbWFpbCI6InJyZXllc0Bzb3BvcnRlcmVhbC5jb20iLCJFbXByZXNhIjoiWkdWdGIyWmxjbkpsIiwiU2VydmVySXAiOiJNVGt5TGpFMk9DNDNMak00IiwidGltZSI6IjIwMjQwNTA4MDUwNTAwIn0.xhtue1k1mlhVk_zHgE_2snQ4wBZuGngo79j_tR-wbOU' 
    });

    let options = { headers: headers};
    const formdata = new FormData();
    formdata.append("email", correo);
    formdata.append("empresa", empresa);
    formdata.append("clave", password);

    return this.http.post<NewResponse>(`${this.APIBase}seguridad/authtoken.php`, formdata, options).pipe(map(resp => resp));
  }
  
  //Trae los permisos del usuario logueado
  permisosUsuario(codigoUsuario:any):Observable<permisosUsuario> {

    this.obtenerUsuario();

      let headers = new HttpHeaders({
        'Authorization': `Bearer ${this.Perfil.Token}` 
      });
  
      let options = { headers: headers };
  
      const formdata = new FormData();

      formdata.append('codigousuario', codigoUsuario);
  

     let resp = this.http.post<permisosUsuario>(`${this.APIBase}seguridad/derechossistemadelusuario.php`,formdata, options).pipe(tap((resp:any) =>{}));
    
     return resp;
      
  }

  //Trae el nombre comercial de la empresa selecionada
  nombreComercial(){

    this.obtenerUsuario();

      let headers = new HttpHeaders({
        'Authorization': `Bearer ${this.Perfil.Token}` 
      });
  
      let options = { headers: headers };
  
      
     let resp = this.http.post<permisosUsuario>(`${this.APIBase}varios/datosempresa.php`, {}, options).pipe(tap((resp:any)=>{}));
    
     return resp;
  }

  parametrosEmpresa(){
    this.obtenerUsuario();

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.Perfil.Token}` 
    });

    let options = { headers: headers };


    const formdata = new FormData();

    let resp = this.http.post(`${this.APIBase}varios/Parametros.php`, formdata, options).pipe(tap((resp:any) =>{}));
  
    return resp;
  }
  
}
