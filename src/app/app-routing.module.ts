import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'inversiones', loadChildren: './inversiones/inversiones.module#InversionesPageModule' },
  { path: 'tarifario', loadChildren: './tarifario/tarifario.module#TarifarioPageModule' },
  { path: 'simulador', loadChildren: './simulador/simulador.module#SimuladorPageModule' },
  { path: 'detalle', loadChildren: './detalle/detalle.module#DetallePageModule' },
  { path: 'estrategia', loadChildren: './estrategia/estrategia.module#EstrategiaPageModule' },
  { path: 'prlv', loadChildren: './prlv/prlv.module#PrlvPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'divisas', loadChildren: './divisas/divisas.module#DivisasPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
