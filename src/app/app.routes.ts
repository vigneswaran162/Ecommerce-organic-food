import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { AddproductsComponent } from './addproducts/addproducts.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductsComponent } from './products/products.component';
import { SwipperComponent } from './swipper/swipper.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

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
   },{
      path:'Swipper',
      component:SwipperComponent
   },
   {
      path:'login',
      component:LoginComponent
   },
   {
      path:'Register',
      component:SignupComponent
   },{
      path:'ForgotPassword',
      component:ForgotpasswordComponent
   }
];
