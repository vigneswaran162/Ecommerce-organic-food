import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { AddproductsComponent } from './addproducts/addproducts.component';

export const routes: Routes = [
   {
    path:'',
    component:MainPageComponent
   },
   {
    path:'AddProducts',
    component:AddproductsComponent
   }
];
