import { Component, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { NgIf, CommonModule } from '@angular/common';  // ✅ Import CommonModule
import { AddproductModel, AddressInfoModel, PaymentModeModel } from '../../model/addprodctmodel';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-checkout',
  imports: [CommonModule,FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  AddCartDetails:any;
  readonly panelOpenState = signal(false);
  CartDetailsDet:any;
  ProctDetails: any;
  isLoading: boolean;
  productslength: number;
  totalPrice: any;
  model:AddressInfoModel;
  paymodel:PaymentModeModel;
  orderidCount:any;
  user:any;
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['2025', '2026', '2027', '2028', '2029'];

  constructor (private service:ProductsService ,private router:Router ,public loginservice:LoginService){
    this.user = this.loginservice.GetuserDetails()

  }

   async ngOnInit() {
    this.isLoading = true
    this.model = new AddressInfoModel();
    this.paymodel = new PaymentModeModel();
    this.productslength = this.service.getProductslength();
    await this.GetProducts();
    this.CartDetails();
    this.isLoading = false;
  }

  CartDetails(){
    this.AddCartDetails = this.service.GetCartDetails();
    this.CartDetailsDet = this.AddCartDetails.map((item1: any) => {
      const product = this.ProctDetails.find((item2: any) => item2.ProductName === item1.ProductName);
      return {
        ...item1,
        ProductImage: product ? product.ProductImage : null // Add only ProductImage
      };
    });

    this.totalPrice = this.CartDetailsDet.reduce((sum: number, item: any) => sum + (item.Price || 0), 0);


    
  }


  async GetProducts(){
    this.isLoading = true
    let response:any = await this.service.GetProductLatestAll().catch(err=>{
        alert(err.message)
        this.isLoading = false

    })
    if(response != undefined){
      this.ProctDetails  = response.data.filter((i:any)=>i.Latest == 'Y')
        this.ProctDetails.forEach((event:any) => {
          if (event.ProductImage) {
            if (!event.ProductImage.startsWith("data:image")) {
              event.ProductImage = `data:image/png;base64,${event.ProductImage}`;
  
            }
          }
        });
  this.isLoading = false        
    }else{
      alert(response.returnerror)
      this.isLoading = false

    }
  }

  submitForm(){

  }

  removeFromCart(index: number) {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      let cart = JSON.parse(storedCart);
      if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart)); 
        this.productslength = this.service.getProductslength();
        this.CartDetails()
      }
    }
  }



  steps = ['Address', 'Payment', 'Confirm'];
  currentStep = 0;

  nextStep(addressForm: NgForm) {
    if (addressForm.valid) {
      this.GetorderID()
      this.currentStep++;
    }
  }
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }


  async nextpay() {
    await this.orderinsert()

    
  }

  OnBlurCCV(event:any){
    if(event.target.value != ""){
      if (!event.target.validity.valid) { 
        this.paymodel.CCV = '';
      }
    }
}
OnBlurNumber(event:any){
  if(event.target.value != ""){
    if (!event.target.validity.valid) { 
      this.paymodel.CardNumber = '';
    }
  }
}


OnBlurAlterphoneNumber(event:any){
  if(event.target.value != ""){
    if (!event.target.validity.valid) { 
      this.model.APhoneNo = '';
    }
  }
}
OnBlurphoneNumber(event:any){
if(event.target.value != ""){
  if (!event.target.validity.valid) { 
    this.model.PhoneNo = '';
  }
}
}
OnBlurName(event:any){
  if(event.target.value != ""){
    if (!event.target.validity.valid) { 
      this.model.Name = '';
    }
  }
}
OnBlurPinCode(event:any){
if(event.target.value != ""){
  if (!event.target.validity.valid) { 
    this.model.PinCode = '';
  }
}
}

homepage(){
  this.router.navigate([''])
}
async nextpaycard() {
  if (this.paymodel.CardNumber && this.paymodel.Month && this.paymodel.Year && this.paymodel.CCV) {
    await this.orderinsert()
  } 
}



preparemodel(){
  const mod = new AddressInfoModel();
  mod.UserName = this.user.UserName
  mod.orderId = this.model.orderId;
  mod.Name = this.model.Name;
  mod.PhoneNo = this.model.PhoneNo;
  mod.APhoneNo= this.model.APhoneNo;
  mod.Address = this.model.Address
  mod.City = this.model.City
  mod.PinCode = this.model.PinCode
  mod.State = this.model.State
  mod.Country = this.model.Country
  mod.LandMark = this.model.LandMark
  mod.PaymentMode = this.model.PaymentMode
  mod.CartDet =[]
  for (let i = 0; i < this.CartDetailsDet.length; i++) {
    let obj ={
      orderId:this.model.orderId,
      customerName:this.model.Name,
      ProductName: this.CartDetailsDet[i].ProductName,
      Category: this.CartDetailsDet[i].ProductName,
      Rate: this.CartDetailsDet[i].Rate,
      price:  this.CartDetailsDet[i].Price,
      CartQuantity: this.CartDetailsDet[i].CartQuantity,
      UserName:this.user.UserName
    }
    mod.CartDet.push(obj)
  }
  return mod
}


async orderinsert(){
  const editmod = this.preparemodel()
  let response:any = await this.service.orderInsert(editmod).catch((err) => {
    alert(err.message)
  });
 if(response != undefined){
  if (response.Boolval == true) { 
    localStorage.removeItem('cart');    
    this.currentStep++;
  } else {
    alert(response.returnerror);
  }
}
}


async GetorderID(){
  this.isLoading = false
  let response:any = await this.service.GetOrderID().catch(err=>{
      alert(err.message)
      this.isLoading = true
  })
  if(response != undefined){
    this.model.orderId  = response.orderid
  }
}  

SelectPaymentMode(Type:any){
 this.model.PaymentMode =Type;
}


}
