import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ProformasService } from 'src/app/services/proformas.service';

@Component({
  selector: 'app-modal-editar-cliente',
  templateUrl: './modal-editar-cliente.component.html',
  styleUrls: ['./modal-editar-cliente.component.scss'],
})
export class ModalEditarClienteComponent implements OnInit {
  @Input() Proforma: any;
  @Input() codigoProforma: any;
  @Input() clienteSeleccionado: any;
  permisosUsuario: any;
  tipoIdentificacion: any;

  constructor(
    private router:Router,
    private modalController: ModalController,
    private proformaServices: ProformasService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.permisosUsuario = JSON.parse(localStorage.getItem('PermisosUsuario') || '[]');
    console.log(this.clienteSeleccionado);
    this.clienteSeleccionado = {
      id_Cliente:
        this.clienteSeleccionado.codigo || this.clienteSeleccionado.ClienteID,
      cedula:
        this.clienteSeleccionado.cedula || this.clienteSeleccionado.Cedula || '',
      tipoIdentificacion:
       this.clienteSeleccionado.cedulatipo || this.clienteSeleccionado.TipoIdentificacion || '',
      ClienteNombre: this.clienteSeleccionado.ClienteNombre || '',
      nombreComercial:
        this.clienteSeleccionado.nombrecomercial ||
        this.clienteSeleccionado.clientenombrecomercial || '',
      telefono:
        this.clienteSeleccionado.telefonos ||
        this.clienteSeleccionado.Telefonos || '',
      email:
        this.clienteSeleccionado.emailgeneral || this.clienteSeleccionado.email || this.clienteSeleccionado.EmailFactura || '',
      tipoPrecio:
        this.clienteSeleccionado.tipoprecio ||
        this.clienteSeleccionado.TipoPrecioVenta || '',
      moneda:
        this.clienteSeleccionado.moneda ||
        this.clienteSeleccionado.monedacodigo || '',
      direccion: this.clienteSeleccionado.direccion || '',
    };
    this.codigoTipoIdentificacion();
    console.log(this.clienteSeleccionado);

  }

  async codigoTipoIdentificacion(){
    const codigoIdentificacion = [
      { codigo: "00", nombre: "No definido" },
      { codigo: "01", nombre: "Cédula Física" },
      { codigo: "02", nombre: "Cédula Jurídica" },
      { codigo: "03", nombre: "DIMEX" },
      { codigo: "04", nombre: "NITE" },
     { codigo: "09", nombre: "Exportación" }
   ];
     const resultado = await codigoIdentificacion.filter((e:any) => e.codigo === this.clienteSeleccionado.tipoIdentificacion);
      this.clienteSeleccionado.tipoIdentificacion = resultado[0].codigo + '-' + resultado[0].nombre;
  }

  tienePermiso(permiso: string): boolean {
    return this.permisosUsuario.includes(permiso);
  }

  confirmar() {
    if(this.clienteSeleccionado.id_Cliente != 'SN' && this.tienePermiso('311')){
      this.proformaServices
      .editarCliente(
        this.clienteSeleccionado.id_Cliente,
        this.clienteSeleccionado.cedula,
        this.clienteSeleccionado.tipoIdentificacion,
        this.clienteSeleccionado.ClienteNombre,
        this.clienteSeleccionado.nombreComercial,
        this.clienteSeleccionado.telefono,
        this.clienteSeleccionado.email,
        this.clienteSeleccionado.tipoPrecio,
        this.clienteSeleccionado.moneda,
        this.clienteSeleccionado.direccion
      )
      .subscribe((resp) => {
        if (resp.code == 200) {
            this.presentarMensaje('Cliente actualizado exitosamente', 'middle');
        }
      });
     
    this.cerrarModalEditarCliente();
    }else if(this.tienePermiso('311')){
      this.proformaServices.editarClienteProforma(this.codigoProforma, this.clienteSeleccionado.id_Cliente,  this.clienteSeleccionado.ClienteNombre,  this.clienteSeleccionado.tipoPrecio,
        this.clienteSeleccionado.moneda).subscribe((resp) => {
          if(resp.code = 200){
            console.log(resp)
            this.presentarMensaje('Cliente actualizado exitosamente', 'middle');
            this.cerrarModalEditarCliente();
          } 
        });
    }else{
      this.presentarMensaje('No es posible actualizar el cliente', 'middle');
    }
    
  }

  cerrarModalEditarCliente() {
    this.modalController.dismiss();
  }

  async presentarMensaje(message: string, position: any) {
    const msj = await this.toastController.create({
      message: message,
      duration: 1000,
      position: position,
    });
  
    await msj.present();
  }
  
}
