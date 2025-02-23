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
    this.APIUrl = this.localurl+'Ecommercelogin?UserName='+UserName+'&Password='+Password;
    let resp = await this.service.get(this.APIUrl).toPromise();
    return resp;
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
