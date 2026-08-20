import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule, Routes } from '@angular/router';
import { PersonaDetailPage } from './persona-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PersonaDetailPage,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [PersonaDetailPage],
})
export class PersonaDetailPageModule {}
