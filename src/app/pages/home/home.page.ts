import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  permisosUsuario: string[] = [];
  Perfil: any;
  codigoProforma: string = '';
  clienteSeleccionado: any;

  constructor(private router:Router, 
              private newService: LoginService) { }

  ngOnInit() {
    this.obtenerUsuario();
  }

    //Obtiene el usuario logueado del LocalStorage
    obtenerUsuario(){
      const perfilStr = localStorage.getItem('Usuario');
      let perfil: {} = {};
      if (perfilStr) {
        this.Perfil = JSON.parse(perfilStr);
      }
      this.validarPermisos();
      return this.Perfil;
      
    }
  facturacion() {
    this.codigoProforma = `U${this.Perfil.Codigo}U`

    let parametros = {
      proforma: this.codigoProforma,
    };
    
    this.router.navigate(['/facturacion'],{
      queryParams: parametros
    });
    
    
   }

  proformas() {
    this.router.navigate(['/proformas']);
   }

   Ventas() {
    this.router.navigate(['/ventas']);
   }

   Clientes() {
    this.router.navigate(['/clientes']);
   }

   Inventario() {
    this.router.navigate(['/invetario']);
   }

   SAC() {
    this.router.navigate(['/sac']);
   }

   CxC() {
    this.router.navigate(['/cx-c']);
   }

   CxP() {
    this.router.navigate(['/cx-p']);
   }

   Provedores() {
    this.router.navigate(['/provedores']);
   }

   Compras() {
    this.router.navigate(['/compras']);
   }

   Usuarios(){
    this.router.navigate(['/usuarios']);
   }

   Resumen(){
    this.router.navigate(['/resumen']);
   }

   validarPermisos(){
    this.newService.permisosUsuario(this.Perfil.Codigo).subscribe(resp=>{
      if(resp.code  == 200){   
        for (let objeto of resp.data) {
          this.permisosUsuario.push(objeto.Cod_Derecho);
          localStorage.setItem('PermisosUsuario', JSON.stringify(this.permisosUsuario));
        }
        this.router.navigate(['/home']);
      }else{
    }});
   }
   
  tienePermiso(permiso: string): boolean {
    return this.permisosUsuario.includes(permiso);
  }
}
