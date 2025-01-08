import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CxPPage } from './cx-p.page';

const routes: Routes = [
  {
    path: '',
    component: CxPPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CxPPageRoutingModule {}
