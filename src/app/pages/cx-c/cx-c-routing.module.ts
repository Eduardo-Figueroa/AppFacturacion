import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CxCPage } from './cx-c.page';

const routes: Routes = [
  {
    path: '',
    component: CxCPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CxCPageRoutingModule {}
