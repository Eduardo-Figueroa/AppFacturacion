import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CxCPageRoutingModule } from './cx-c-routing.module';

import { CxCPage } from './cx-c.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CxCPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CxCPage]
})
export class CxCPageModule {}
