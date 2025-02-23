import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
declare let toastr: any; 

@Component({
  selector: 'app-forgotpassword',
  imports: [FormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent implements OnInit {
  Email:any;
  UserPassword:any;
  UserDetails: any;


  constructor ( private service:LoginService ,private router:Router ,private pservice:ProductsService){}
    async ngOnInit() {
      await this.GetUserDetails()
      toastr.options = {
        progressBar: true,
        positionClass: 'toast-top-right',
        timeOut: 3000,
        preventDuplicates: true,
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
        extendedTimeOut: 1000
      };
    }
    
    formvalidation(){
      if(this.Email == '' || this.Email == undefined || this.Email == null){
        toastr.info('Email Address Cannot Be Blank','');
        return false
      }
      return true
    }
    
    
    async GetOTP(event:any){
      if(this.formvalidation()== true){
        event.target.disabled = true;
        let entity = {
          Email:this.Email
        }
        let response:any = await this.service.GetOTP(entity).catch(err=>{
          toastr.error(err.message,'');
        })
        if(response != undefined){
          if(response.Boolval == true){
            toastr.success(response.msg,'');
          }else{
            toastr.error(response.returnerror,'');
            event.target.disabled = false;
    
          }
      }
    }
    }


    OnBlurUserEmail(event:any){
      let fillter = this.UserDetails.filter((i:any)=>i.Email == this.Email)
      if(fillter.length == 0){
        toastr.error('Invalid Email Address','');
        this.Email =''
      }
    }


    async GetUserDetails(){
      let response:any = await this.pservice.GetUserDetailsAll().catch(err=>{
          toastr.error(err.message,'');
      })
      if(response != undefined){
        this.UserDetails  = response.data
      }else{
        toastr.error(response.returnerror,'');
      }
    }  
}
