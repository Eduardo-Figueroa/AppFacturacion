import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Empresa } from '../../interfaces/login';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public empresa: Empresa[] = [];

  usuario = {
    correo: '',
    empresa: '',
    password: ''
  };

  constructor(private router:Router, 
              private loginService: LoginService,
              private alertaController: AlertController) {
  
   }

  ngOnInit() {
    
  }

  obtenerEmpresas(correo: any){
    this.empresa = [];
    this.loginService.obtenerEmpresas(correo).subscribe(resp=>{
      if(resp.code  == 200){
        this.empresa.push(...resp.data);
      }else{
        this.empresa = [];
      }
    });
  }

  async ingresar() {
    this.loginService.login(this.usuario.correo, this.usuario.empresa, this.usuario.password).subscribe(resp=>{
      if(resp.code  == 200){       
        localStorage.setItem('Usuario', JSON.stringify(resp.data));
        this.usuario = {
          correo: '',
          empresa: '',
          password: ''
        };
        this.empresa = [];
        this.router.navigate(['/home']);
      }else{
        
        this.presentarAlerta(resp.data);
    }});
  }

  async presentarAlerta(mensajeError: any) {
    const alerta = await this.alertaController.create({
      header: mensajeError,
      message: 'Por favor verifique los datos.',
      buttons: ['Aceptar'],
    });
    await alerta.present();
  }



}
