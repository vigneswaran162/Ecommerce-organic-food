import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { LoginService } from '../../services/login.service';
declare var Swiper: any;
declare let toastr: any; 

@Component({
  selector: 'app-main-page',
  imports: [NavbarComponent,FormsModule,CommonModule,NgIf],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {

  productslength:number | undefined; 
  ProctDetails: any;
  AddCartDetails:any;
  isModalOpen = false;
  isLoading =false

  @ViewChild(NavbarComponent) navbar!: NavbarComponent;

  CartDetailsDet:any


  constructor( private router:Router , private service:ProductsService ,public loginservice:LoginService){}


  async ngOnInit() {
    this.isLoading = true
    await this.GetProducts()
    this.CartDetails()
    this.productslength = this.service.getProductslength();

    setTimeout(() => {
      new Swiper('.mySwiper', {
        slidesPerView: 'auto', // Adjust width dynamically
        spaceBetween: 20, // Space between slides
        loop: true,
        // centeredSlides: true, // Center slides
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }, 100);



    toastr.options = {
      progressBar: true,
      positionClass: 'toast-top-right',
      timeOut: 3000,
      preventDuplicates: true,
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
      extendedTimeOut: 1000
    };


    this.isLoading = false

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

    if(this.loginservice.isLoggedIn()){
    this.service.addToCart(item);
    this.navbar.callNavbar();
    this.AddCartDetails = this.service.GetCartDetails();
    this.CartDetails()
    }else{
      toastr.info('You must be logged in to proceed with Add to Cart.','');
    }
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
  

  


  BuyNow(item:any){
    if(this.loginservice.isLoggedIn()){
      this.service.addToCart(item);
      this.router.navigate(['/CheckOut'])
    }else{
      toastr.info('You must be logged in to proceed with Buy Now.','');
    }
  }
}
