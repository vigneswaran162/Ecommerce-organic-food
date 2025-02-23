import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

import { ActivatedRoute,Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private APIUrl: string ;
  public userdetail =[] 

  private apiurl:string = 'https://backendvercel-brown.vercel.app/'
  private localurl:string = 'http://localhost:8000/'

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private service: HttpClient ,private router:Router) {}


  async Login(UserName: string,Password:string) {
    this.APIUrl = this.apiurl+'Ecommercelogin?UserName='+UserName+'&Password='+Password;
    let resp = await this.service.get(this.APIUrl).toPromise();
    return resp;
  }
  

  async GetOTP(entity:any): Promise<any> {
    // this.APIUrl = this.apiurl+'Addproducts';
    this.APIUrl = this.apiurl+'forgotpasswordOTP';
  let headers = new HttpHeaders({
    'content-Type': 'application/json',
    Accept: 'application/json',
  });
  let options = {
    headers: headers,
  };
  let res = await this.service.post(this.APIUrl, entity, options).toPromise()
  return res;
  }



  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('currentUser');
    }
    return null;
  }

  isLoggedIn(): boolean { 
    return isPlatformBrowser(this.platformId) && !!this.getToken();
  }
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    this.router.navigate([''])
  }

  GetuserDetails() {
    const storedCart = localStorage.getItem('currentUser');
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      return cart
    }
  }
}
