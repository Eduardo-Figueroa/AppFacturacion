import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'facturacion',
    loadChildren: () => import('./pages/facturacion/facturacion.module').then( m => m.FacturacionPageModule)
  },
  {
    path: 'proformas',
    loadChildren: () => import('./pages/proformas/proformas.module').then( m => m.ProformasPageModule)
  },  {
    path: 'ventas',
    loadChildren: () => import('./pages/ventas/ventas.module').then( m => m.VentasPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'invetario',
    loadChildren: () => import('./pages/invetario/invetario.module').then( m => m.InvetarioPageModule)
  },
  {
    path: 'sac',
    loadChildren: () => import('./pages/sac/sac.module').then( m => m.SacPageModule)
  },
  {
    path: 'cx-c',
    loadChildren: () => import('./pages/cx-c/cx-c.module').then( m => m.CxCPageModule)
  },
  {
    path: 'cx-p',
    loadChildren: () => import('./pages/cx-p/cx-p.module').then( m => m.CxPPageModule)
  },
  {
    path: 'provedores',
    loadChildren: () => import('./pages/provedores/provedores.module').then( m => m.ProvedoresPageModule)
  },
  {
    path: 'compras',
    loadChildren: () => import('./pages/compras/compras.module').then( m => m.ComprasPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./pages/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'resumen',
    loadChildren: () => import('./pages/resumen/resumen.module').then( m => m.ResumenPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
