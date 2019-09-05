import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InversionesPage } from './inversiones.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: InversionesPage,
    children: [
      {
        path: 'tab1',
        loadChildren: '../estrategia/estrategia.module#EstrategiaPageModule'
      },
      {
        path: 'tab2',
        loadChildren: '../prlv/prlv.module#PrlvPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InversionesPage]
})
export class InversionesPageModule {}
