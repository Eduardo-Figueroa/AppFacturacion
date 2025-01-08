import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DatePickerComponent } from 'src/app/components/date-picker/date-picker.component';
import { ProformasService } from 'src/app/services/proformas.service';

@Component({
  selector: 'app-proformas',
  templateUrl: './proformas.page.html',
  styleUrls: ['./proformas.page.scss'],
})
export class ProformasPage implements OnInit {
  fechaFinal: any;
  fechaInicial: any;
  Perfil: any;
  codigoProforma: string = '';
  nuevaFechaInicial: any;
  proformas: any;
  cliente: any;
  clienteCodigo: any;
  monto:any;
  Agente: any;
  tipo: any;
  numeroRegistros: any;
  private modalAbierto: boolean = false;
  permisosUsuario: any;
  usuarioCodigo: any;
  
  constructor(private router:Router,
              private modalController: ModalController,
              private proformaServices: ProformasService,
              private alertaController: AlertController
             ) { }

  ngOnInit() {
    this.obtenerUsuario();
    this.permisosUsuario = JSON.parse(localStorage.getItem('PermisosUsuario') || '[]');
  }

  tienePermiso(permiso: string): boolean {
    return this.permisosUsuario.includes(permiso);
  }
 

  obtenerUsuario(){
    const perfilStr = localStorage.getItem('Usuario');
    let perfil: {} = {};
    if (perfilStr) {
      this.Perfil = JSON.parse(perfilStr);
    }
    return this.Perfil;
  }
 
  Limpiar(){
    this.fechaFinal = '';
    this.fechaInicial = '';
    this.clienteCodigo = '';
    this.usuarioCodigo = '';
    this.cliente = '';
    this.monto = '';
    this.Agente= '';
    this.tipo= '';
    this.numeroRegistros = '';
    this.proformas = [];
  }

  nuevaProforma(){
    this.codigoProforma = `U${this.Perfil.Codigo}U`

    let parametros = {
      proforma: this.codigoProforma,
    };
    
    this.router.navigate(['/facturacion'],{
      queryParams: parametros
    });
  }

  async abrirFechas(fecha: any) {
    if (this.modalAbierto) return;

    this.modalAbierto = true;
    const modal = await this.modalController.create({
      component: DatePickerComponent,
      initialBreakpoint: 0.6,
      backdropDismiss: false,
      componentProps: {
        tipo: fecha,
      }
    });

    modal.onDidDismiss().then((result) => {
      this.modalAbierto = false;
      if (result.data) {
        if(fecha == 'final'){
          this.fechaFinal = result.data
        }else{
          this.fechaInicial = result.data
        }
      }
    });

    return await modal.present();
  }

  cargarProformas(){
    if(this.fechaInicial != undefined &&  this.fechaFinal != undefined && this.tipo != undefined){
      if(this.fechaInicial < this.fechaFinal){
        this.proformaServices.obtenerProformas(this.fechaInicial, this.fechaFinal, this.clienteCodigo, this.usuarioCodigo, this.monto, this.Agente, this.cliente, this.tipo).subscribe(resp => {
          if(resp.code  == 200){
            this.proformas = resp.resultado.data;
            this.numeroRegistros = resp.resultado.registros
          }
        })
      }else{
        this.presentarAlerta('Datos Incorrectos', 'por favor verificar las fechas');
      }
    }else{
      this.presentarAlerta('Datos Incorrectos', 'por favor verificar los datos');
    }
  }

  verProforma(i: number, numero: any){

      this.codigoProforma = numero
  
      let parametros = {
        proforma: this.codigoProforma,
      };
      
      this.router.navigate(['/facturacion'],{
        queryParams: parametros
      });

  }

  async presentarAlerta(header: string, message: string) {
    const alerta = await this.alertaController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
    });

    await alerta.present();
  }

}
