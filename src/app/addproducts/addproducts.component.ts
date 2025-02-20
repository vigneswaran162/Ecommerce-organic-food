import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { AddproductModel } from '../../model/addprodctmodel';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-addproducts',
  imports: [FormsModule],
  templateUrl: './addproducts.component.html',
  styleUrl: './addproducts.component.css'
})
export class AddproductsComponent {

  model:AddproductModel;
  isUpdate=false
  constructor (private service:ProductsService){}
  ngOnInit(): void {
    this.model = new AddproductModel();
  }


  preparemodel(){
    const mod = new AddproductModel();
    mod.ProductNo = this.model.ProductNo;
    mod.ProductDate = this.model.ProductDate;
    mod.ProductName = this.model.ProductName;
    mod.Category = this.model.Category;
    mod.Rate = this.model.Rate;
    mod.Quantity = this.model.Quantity;
    mod.QuantityDescription = this.model.QuantityDescription;
    if (this.model.ProductImage != null && this.model.ProductImage != '') {
      mod.ProductImage = this.model.ProductImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      // mod.ProductImage = this.base64ToArrayBuffer(mod.ProductImage)
    }
    mod.Trending = this.model.Trending;
    mod.Latest= this.model.Latest;
    mod.Status = this.model.Status;
    mod.Void = 'N'
    mod.CartQuantity = '0'
    return mod
  }
  
  displayImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.model.ProductImage = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }
  onSubmit(){
    
    const editmod = this.preparemodel()
    editmod.OpsType ='S'
    editmod.createdBy='Admin'
    this.CRUD(editmod)


  }

  base64ToArrayBuffer(base64:any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }


  async CRUD(_model:AddproductModel) {
    let response:any = await this.service.CRUD(_model).catch((err) => {
      // this.toast.showError(err.message,'');
    });
   if(response != undefined){
    if (response.Boolval == true) {     
       if(this.isUpdate){
        alert('Tk')
       }else{
        alert('Tk')
       }
      
    } else {
      // this.toast.showError(response.returnerror,'');
    }
  }
   }

   onClear(){
    this.model = new AddproductModel();
   }
}
