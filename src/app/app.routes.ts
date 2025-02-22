import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { AddproductsComponent } from './addproducts/addproducts.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
   {
    path:'',
    component:MainPageComponent
   },
   {
    path:'AddProducts',
    component:AddproductsComponent
   },{
    path:'CheckOut',
    component:CheckoutComponent
   },{
      path:'Products/:type',
      component:ProductsComponent
   }
];
