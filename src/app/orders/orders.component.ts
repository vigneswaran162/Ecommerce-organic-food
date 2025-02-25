import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoginService } from '../../services/login.service';
import { ProductsService } from '../../services/products.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-orders',
  imports: [NavbarComponent ,NgIf,CommonModule,FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  searchText:any;
  isLoading:boolean=false;
  user:any;
  AddressDet:any;
  OrdersDet:any;
  ProctDetails:any;
  FilteredAddresDet:any;
  totalPrice: any;
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


  




Addressinfo(item:any){
  this.FilteredAddresDet = this.AddressDet.find((i:any)=> i.orderId == item.orderId)
  this.totalPrice = this.FilteredAddresDet.CartDet.reduce((sum: number, item: any) => sum + (item.price || 0), 0);

}


generatePDF() {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text('ORGANIC', 160, 15);
  doc.setFontSize(18);
  doc.text('Tax Invoice', 14, 25);
  doc.setFontSize(12);
  doc.text('Bill To / Ship To:', 14, 35);
  doc.text(`OrderId: ${this.FilteredAddresDet?.orderId || ''}`, 14, 42);

  doc.text(`Name: ${this.FilteredAddresDet?.Name || ''}`, 14, 49);

  doc.text(`Address: ${this.FilteredAddresDet?.Address || ''}`, 14, 59);
  doc.text(`City: ${this.FilteredAddresDet?.City || ''}, PinCode: ${this.FilteredAddresDet?.PinCode || ''}`, 14, 66);
  doc.text(`State: ${this.FilteredAddresDet?.State || ''}, Country: ${this.FilteredAddresDet?.Country || ''}`, 14, 73);
  autoTable(doc, {
    startY: 83, // Adjust spacing before table
    head: [['Product Name', 'Rate', 'Quantity', 'Price']],
    body: this.FilteredAddresDet?.CartDet?.map((item: any) => [
      item.ProductName, item.Rate, item.CartQuantity,item.price
    ]) || [],
    theme: 'grid',
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 90; // Ensure fallback Y value


  doc.setFontSize(14);
  doc.text(`Grand Total:  ${this.totalPrice || 0}`, 14, finalY + 10);


  doc.save(`order-summary-${this.FilteredAddresDet?.orderId || 'unknown'}.pdf`);

}




}
