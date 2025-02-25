import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoginService } from '../../services/login.service';
import { ProductsService } from '../../services/products.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [NavbarComponent ,NgIf,CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {


  isLoading:boolean=false;
  user:any;
  AddressDet:any;
  OrdersDet:any;
  ProctDetails:any
  constructor (private service:LoginService ,private productservice:ProductsService){
    this.user = this.service.GetuserDetails()

  }

  async ngOnInit() {
    await this.GetProducts()
    await this.GetorderID(this.user.UserName)

  }




  async GetorderID(UserName:any){
    this.isLoading = true
    let response:any = await this.service.Getorders(UserName).catch(err=>{
        alert(err.message)
        this.isLoading = false
    })
    if(response != undefined){
      this.AddressDet = response.data1
      this.OrdersDet = response.data2;
      this.OrdersDet = response.data2.map((item1: any) => {
        const product = this.ProctDetails.find((item2: any) => item2.ProductName === item1.ProductName);
        return {
          ...item1,
          ProductImage: product ? product.ProductImage : null // Add only ProductImage
        };
      });
      this.isLoading = false


    }else{
      this.isLoading = false
    }
  }  



  async GetProducts(){
    this.isLoading = true
    let response:any = await this.productservice.GetProductLatestAll().catch(err=>{
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

}
