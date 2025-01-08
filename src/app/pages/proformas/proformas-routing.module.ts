import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProformasPage } from './proformas.page';

const routes: Routes = [
  {
    path: '',
    component: ProformasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProformasPageRoutingModule {}
