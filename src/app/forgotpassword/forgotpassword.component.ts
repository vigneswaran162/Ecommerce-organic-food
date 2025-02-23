import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CommonModule, NgIf } from '@angular/common';
declare let toastr: any; 

@Component({
  selector: 'app-forgotpassword',
  imports: [FormsModule ,CommonModule,NgIf],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent implements OnInit {
  Email:any;
  UserPassword:any;
  ConPassword:any;
  UserDetails: any;
  isGetOtp:boolean =false
  OTPNumber:string;
  OTPNumberDetails: any;


  constructor ( public service:LoginService ,private router:Router ,private pservice:ProductsService){}
    async ngOnInit() {
      this.isGetOtp = false
      await this.GetUserDetails()
      await this.GetOtpNumer()
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
             
            const authData = {
              Email:this.Email,
        
            };
            localStorage.setItem('EmailSent', JSON.stringify(authData));
            await this.GetOtpNumer()

            event.target.disabled = false;
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
    OnBlurOTP(event: any) {
      let filter = this.OTPNumberDetails.filter((i: any) => i.resetToken === event.target.value);
    
      if (filter.length > 0) {
        toastr.success('OTP Number is Valid', '');
        this.isGetOtp = true;
      } else {
        toastr.error('Invalid OTP Number', '');
        this.OTPNumber = '';
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


    async GetOtpNumer(){
      let response:any = await this.service.GetOtpNumber().catch(err=>{
          toastr.error(err.message,'');
      })
      if(response != undefined){
        this.OTPNumberDetails  = response.data
      }else{
        toastr.error(response.returnerror,'');
      }
    }  


    OnBlurPhoneNumber(event:any){
      if(event.target.value != ""){
        if (!event.target.validity.valid) { 
          this.UserPassword =''
          toastr.info('Password Must be Minimum 4 Characters')
        }
      }
    }

    OnBlurConfrim(event:any){
     if(this.UserPassword != this.ConPassword){
      toastr.info('Password and Confirm Password should match');     
      this.ConPassword =''
    }
    }


    passformvalidation(){
      if(this.UserPassword == '' || this.UserPassword == undefined || this.UserPassword == null){
        toastr.info('Password Cannot Be Blank','');
        return false
      }
      if(this.ConPassword == '' || this.ConPassword == undefined || this.ConPassword == null){
        toastr.info('Confrim Password Cannot Be Blank','');
        return false
      }
      return true
    }

    async  UpdatePassword(event:any){
      if(this.passformvalidation()== true){
        event.target.disabled = true;
        const storedCart = localStorage.getItem('EmailSent');
        let entity
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart); 
           entity = {
            Email: parsedCart.Email, 
            Password: this.UserPassword
          };
          console.log(entity);
        }
    
        let response:any = await this.service.UpdatePassword(entity).catch(err=>{
          toastr.error(err.message,'');
        })
        if(response != undefined){
          if(response.Boolval == true){
            localStorage.removeItem('EmailSent');
            toastr.success('Your password has been updated successfully!', '');
            this.router.navigate(['/login'])
            event.target.disabled = false;
           
          }else{
            toastr.error(response.returnerror,'');
            event.target.disabled = false;
    
          }
      }
    }
    }
}
