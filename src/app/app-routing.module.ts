import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsFormComponent } from './details-form/details-form.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: DetailsFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
