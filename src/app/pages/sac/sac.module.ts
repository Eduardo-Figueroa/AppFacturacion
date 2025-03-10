import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SacPageRoutingModule } from './sac-routing.module';

import { SacPage } from './sac.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SacPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SacPage]
})
export class SacPageModule {}
