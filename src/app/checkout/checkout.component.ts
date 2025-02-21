import { Component, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { NgIf, CommonModule } from '@angular/common';  // ✅ Import CommonModule


@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
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


  constructor (private service:ProductsService){}

   async ngOnInit() {
    this.isLoading = true
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





}
