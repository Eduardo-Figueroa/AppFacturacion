import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProformasPageRoutingModule } from './proformas-routing.module';

import { ProformasPage } from './proformas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProformasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProformasPage]
})
export class ProformasPageModule {}
