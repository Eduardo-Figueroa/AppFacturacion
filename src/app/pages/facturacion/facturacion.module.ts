import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FacturacionPageRoutingModule } from './facturacion-routing.module';

import { FacturacionPage } from './facturacion.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,

    IonicModule,
    FacturacionPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [FacturacionPage]
})
export class FacturacionPageModule {}
