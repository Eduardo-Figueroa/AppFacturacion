import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvetarioPage } from './invetario.page';

const routes: Routes = [
  {
    path: '',
    component: InvetarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvetarioPageRoutingModule {}
