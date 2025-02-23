import { Component, OnInit } from '@angular/core';
import { RegisterModel } from '../../model/addprodctmodel';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
declare let toastr: any; 

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

model:RegisterModel
  isLoading: boolean;
  UserDetails: any;
  constructor( private service:ProductsService ,private router:Router){}
  async ngOnInit(){
    this.model = new RegisterModel();
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
    if(this.model.UserName == '' || this.model.UserName == undefined || this.model.UserName == null){
      toastr.info('UserName Cannot Be Blank','');
      return false
    }
    if(this.model.Email == '' || this.model.Email == undefined || this.model.Email == null){
      toastr.info(' Email Address Cannot Be Blank','');
      return false
    }
    if(this.model.PhoneNo == '' || this.model.PhoneNo == undefined || this.model.PhoneNo == null){
      toastr.info(' Phone No Cannot Be Blank','');
      return false
    }
    if(this.model.Password == '' || this.model.Password == undefined || this.model.Password == null){
      toastr.info(' Password Cannot Be Blank','');
      return false
    }
    return true
  }



  preparemodel(){
    const mod = new RegisterModel();
    mod.UserName = this.model.UserName;
    mod.Email = this.model.Email;
    mod.PhoneNo = this.model.PhoneNo;
    mod.Password= this.model.Password;
    mod.role = 'USER'
    return mod
  }
  
  
  async onsubmit(event:any){
   if(this.formvalidation()== true){
    event.target.disabled = true;
    const editmod = this.preparemodel()
    let response:any = await this.service.Register(editmod).catch((err) => {
      toastr.error(err.message,'');
    });
   if(response != undefined){
    if (response.Boolval == true) { 
      event.target.disabled = false;
      toastr.success('Sucessfully Account Created ','');
      this.router.navigate(['/login'])
    } else {
      toastr.error(response.returnerror,'');
      event.target.disabled = false;
    }
  }
   }
  }



  OnBlurPhoneNumber(event:any){
    if(event.target.value != ""){
      if (!event.target.validity.valid) { 
        this.model.PhoneNo =''
      }
    }
    let fillter = this.UserDetails.filter((i:any)=>i.PhoneNo == this.model.PhoneNo)
    if(fillter.length > 0){
      toastr.error('Phone No Already Exists','');
      this.model.PhoneNo =''
    }
    }


    OnBlurUserName(event:any){
      if(event.target.value != ""){
        if (!event.target.validity.valid) { 
          this.model.UserName =''
        }

        let fillter = this.UserDetails.filter((i:any)=>i.UserName == this.model.UserName)
        if(fillter.length > 0){
          toastr.error('UserName Already Exists','');
          this.model.UserName =''
        }

      }
      }
      OnBlurUserEmail(event:any){
        if(event.target.value != ""){
          if (!event.target.validity.valid) { 
            this.model.Email =''
          }
        }

        let fillter = this.UserDetails.filter((i:any)=>i.Email == this.model.Email)
        if(fillter.length > 0){
          toastr.error('Email Address Already Exists','');
          this.model.Email =''
        }
      }



      async GetUserDetails(){
        this.isLoading = false
        let response:any = await this.service.GetUserDetailsAll().catch(err=>{
            toastr.error(err.message,'');
            this.isLoading = true
        })
        if(response != undefined){
          this.UserDetails  = response.data
        }else{
          toastr.error(response.returnerror,'');
        }
      }  

      login(){
        this.router.navigate(['/login'])
      }
}
