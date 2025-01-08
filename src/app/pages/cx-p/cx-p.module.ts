import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CxPPageRoutingModule } from './cx-p-routing.module';

import { CxPPage } from './cx-p.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CxPPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CxPPage]
})
export class CxPPageModule {}
