import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private APIUrl: string;
  constructor(private http:HttpClient) { }
  private cart:any[] = [];
  private apiurl:string = 'https://backendvercel-brown.vercel.app/'
  private localurl:string = 'http://localhost:8000/'
  addToCart(product:any): void {
    let storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProduct = storedCart.find((p: any) => p.ProductName === product.ProductName);
    if (existingProduct) {
      existingProduct.CartQuantity += product.CartQuantity;
      existingProduct.Price = existingProduct.Rate * existingProduct.CartQuantity;
    } else {
      let price = product.Rate * product.CartQuantity
      storedCart.push({ProductName:product.ProductName,Rate:product.Rate,Price:price,CartQuantity:product.CartQuantity});
    }
  
    localStorage.setItem('cart', JSON.stringify(storedCart));
  }

  getProductslength(): number {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      return cart.length;
    }
    return 0;
  }

  GetCartDetails() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      return cart
    }
  }



  async GetProductDetails(Category:any) {
    // this.APIUrl = this.localurl+'GetProductAll?Category='+Category;

    this.APIUrl = this.apiurl+'GetProductAll?Category='+Category;
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }


  async GetProductLatestAll() {
    this.APIUrl = this.apiurl+'GetProductLatestAll';
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }
  
async CRUD(entity:any): Promise<any> {
  if (entity.OpsType == "S") {
    // this.APIUrl = this.apiurl+'Addproducts';
    this.APIUrl = this.localurl+'Addproducts';

  }
  else if (entity.OpsType == "U") {
    this.APIUrl = 'http://localhost:3000/api/AddEvents/Update';
  }
  else if (entity.OpsType == "V") {
    this.APIUrl = 'http://localhost:3000/api/AddEvents/Delete';
  }
  let headers = new HttpHeaders({
    'content-Type': 'application/json',
    Accept: 'application/json',
  });
  let options = {
    headers: headers,
  };
  let res = await this.http.post(this.APIUrl, entity, options).toPromise()
  return res;
  }
}
