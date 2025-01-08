import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ModalProductosComponent } from './modal-productos/modal-productos.component';
import { ModalDescuentosComponent } from './modal-descuentos/modal-descuentos.component';
import { ModalClientesComponent } from './modal-clientes/modal-clientes.component';
import { ModalEditarProductoComponent } from './modal-editar-producto/modal-editar-producto.component';
import { ModalPagosComponent } from './modal-pagos/modal-pagos.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { ModalOpcionesComponent } from './modal-opciones/modal-opciones.component';
import { ModalEditarClienteComponent } from './modal-editar-cliente/modal-editar-cliente.component';
import { ModalIvadiferenteComponent } from './modal-ivadiferente/modal-ivadiferente.component';
import { ModalBluetoothComponent } from './modal-bluetooth/modal-bluetooth.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ModalProductosComponent,
    ModalDescuentosComponent,
    ModalClientesComponent,
    ModalEditarProductoComponent,
    ModalPagosComponent,
    DatePickerComponent,
    ModalOpcionesComponent,
    ModalEditarClienteComponent,
    ModalIvadiferenteComponent,
    ModalBluetoothComponent
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    ModalProductosComponent,
    ModalDescuentosComponent,
    ModalClientesComponent,
    ModalEditarProductoComponent,
    ModalPagosComponent,
    DatePickerComponent,
    ModalOpcionesComponent,
    ModalEditarClienteComponent,
    ModalIvadiferenteComponent,
    ModalBluetoothComponent
  ],
  imports: [
    CommonModule,
    IonicModule,    
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ComponentsModule { }
