import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-products',
  imports: [FormsModule,CommonModule,NavbarComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  ProctDetails: any;
  AddCartDetails:any;
  CartDetailsDet: any;
  searchText: string = ''; 
  Category:any
  isLoading  = false ;
constructor (private service:ProductsService, private route: ActivatedRoute,private router:Router
){}
async ngOnInit() {
  
  const param = this.route.snapshot.paramMap.get('type')
  if (param != undefined  && param != null) {
      await this.GetProducts(param)
      this.Category = param;
  }

}
  





async GetProducts(param:any){
  this.isLoading = false
  let response:any = await this.service.GetProductDetails(param).catch(err=>{
      alert(err.message)
      this.isLoading = true
  })
  if(response != undefined){
    this.ProctDetails  = response.data
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
this.isLoading = true

  }else{
    this.isLoading = true
    alert(response.returnerror)
  }
}



async AddCart(item:any){
  this.service.addToCart(item);
  this.AddCartDetails = this.service.GetCartDetails();
  this.CartDetails()
}



CartDetails(){
  this.AddCartDetails = this.service.GetCartDetails();
  this.CartDetailsDet = this.AddCartDetails.map((item1: any) => {
    const product = this.ProctDetails.find((item2: any) => item2.ProductName === item1.ProductName);
    return {
      ...item1,
      ProductImage: product ? product.ProductImage : null
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
  this.service.addToCart(item);
  this.router.navigate(['/CheckOut'])
}





getFilteredProducts() {
  this.isLoading = false;

  console.log(this.isLoading)
  const filteredProducts = this.ProctDetails.filter((item: any) =>
    item.ProductName.toLowerCase().includes(this.searchText.toLowerCase())
  );

  this.isLoading = true; 

  return filteredProducts;
}



async SelecCategory(){
  this.isLoading = false
  let response:any = await this.service.GetProductDetails(this.Category).catch(err=>{
      alert(err.message)
      this.isLoading =false
  })
  if(response != undefined){
    this.ProctDetails  = response.data
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
this.isLoading =true
  }else{
    this.isLoading =true
    alert(response.returnerror)
  }
}

}
