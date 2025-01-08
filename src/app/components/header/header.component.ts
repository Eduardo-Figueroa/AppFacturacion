import { Component, Input, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  {

  @Input() codigoProforma: any;

  Empresa: string = '';
  Perfil: any;
  Logo: any;

  constructor(private newService: LoginService) { }

  ngOnInit() {
    this.headerEmpresa();
    this.parametrosEmpresa();
  }

  parametrosEmpresa(){

    this.newService.parametrosEmpresa().subscribe((resp)=>{
      if(resp.code == 200){
        let parametros: any[] = [];
        resp.data.forEach((dato:any) => {
          parametros.push(dato);
        });
        localStorage.setItem('ParametrosEmpresa',JSON.stringify(parametros));
        //this.obtenerParametro(280);
      }else{
        console.log(resp)
      }
    });
  }

  obtenerParametro(parametro:number){
    let parametrosJSON : any[] = JSON.parse(localStorage.getItem('ParametrosEmpresa') || '[]');
    
    let dato:any =  parametrosJSON.find((element) => element.Parametro == parametro);
    return dato.Valor;
  }
  headerEmpresa(){
    
    this.newService.nombreComercial().subscribe(resp => {
      if(resp.code  == 200){   
        this.Empresa = resp.data[1].valor;
        localStorage.setItem('Empresa', JSON.stringify(resp.data));


      }else{
      }}),
    this.Perfil = this.newService.obtenerUsuario();

  }


}
