import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvetarioPageRoutingModule } from './invetario-routing.module';

import { InvetarioPage } from './invetario.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvetarioPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InvetarioPage]
})
export class InvetarioPageModule {}
