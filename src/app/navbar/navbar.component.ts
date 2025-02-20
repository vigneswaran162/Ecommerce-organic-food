import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  isModalOpen = false;
  isLoading =false
  productslength:number | undefined; 
  ProctDetails: any;
  AddCartDetails:any;
  CartDetailsDet:any
  showToast: boolean = false;
  constructor(private service:ProductsService ,private cdr:ChangeDetectorRef,private router:Router){
  }
  ngOnInit(): void {
    this.productslength = this.service.getProductslength();
  }


  checkout(){
    if(this.productslength != 0){
    this.router.navigate(['/CheckOut'])
    }else{
      this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3500);  
    }
  }
  callNavbar(){
    this.productslength = this.service.getProductslength();
    console.log(this.productslength,'56')
    this.cdr.detectChanges();


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

  async onClickModel(){
    this.isLoading =true
    this.isModalOpen = !this.isModalOpen
    await this.GetProducts()
    this.productslength = this.service.getProductslength();
    this.AddCartDetails = this.service.GetCartDetails();
    this.CartDetails()
    this.isLoading =false

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
}
