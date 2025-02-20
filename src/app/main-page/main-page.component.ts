import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  imports: [NavbarComponent,FormsModule,CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {

  productslength:number | undefined; 
  ProctDetails: any;
  AddCartDetails:any;
  isModalOpen = false;
  isLoading =false

  CartDetailsDet:any


  constructor( private router:Router , private service:ProductsService){}


  async ngOnInit() {
    await this.GetProducts()
    this.CartDetails()
    this.productslength = this.service.getProductslength();
  }



  SelectCategory(type:any){
    this.router.navigate(['Products',type])
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
  
     this.ProctDetails = this.ProctDetails.map((event: any) => ({
    ...event,
    CartQuantity: 1 ,
    Price:0
  }));
  this.isLoading = false



        
    }else{
      alert(response.returnerror)
      this.isLoading = false

    }
  }




  async AddCart(item:any){
    this.service.addToCart(item);
    this.productslength = this.service.getProductslength();
    this.AddCartDetails = this.service.GetCartDetails();
    this.CartDetails()
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
  
  
  CartDetails(){
    this.AddCartDetails = this.service.GetCartDetails();
    this.CartDetailsDet = this.AddCartDetails.map((item1: any) => {
      const product = this.ProctDetails.find((item2: any) => item2.ProductName === item1.ProductName);
      return {
        ...item1,
        ProductImage: product ? product.ProductImage : null // Add only ProductImage
      };
    });

  }
  
  
  add(item: any) {
    if (!item.CartQuantity) {
      item.CartQuantity = 1; 
    } else {
      item.CartQuantity++; 
      const existingProduct = this.CartDetailsDet.find((p: any) => p.ProductName === item.ProductName);
      if (existingProduct) {
        existingProduct.CartQuantity = item.CartQuantity;
        existingProduct.Price = existingProduct.Rate * existingProduct.CartQuantity;
      } 
    } 
  }
  
  minus(item: any) {
    if (item.CartQuantity && item.CartQuantity > 1) {
      item.CartQuantity--; 
      const existingProduct = this.CartDetailsDet.find((p: any) => p.ProductName === item.ProductName);
      if (existingProduct) {
        existingProduct.CartQuantity = item.CartQuantity;
        existingProduct.Price = existingProduct.Rate * existingProduct.CartQuantity;
      } 
    }
  }
  

  
  checkout(){
    if(this.CartDetails.length >0){
    this.router.navigate(['/CheckOut'])
    }else{
      // this.Toast.showError('Your Cart is Empty','')
  
    }
  }

  BuyNow(item:any){
    this.service.addToCart(item);
    this.router.navigate(['/CheckOut'])
  }
}
