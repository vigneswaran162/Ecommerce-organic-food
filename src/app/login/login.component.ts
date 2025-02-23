import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';


declare let toastr: any; 

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit{

  UserName:string;
  UserPassword:string;
  constructor ( private service:LoginService ,private router:Router){}
  ngOnInit(): void {
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
    if(this.UserName == '' || this.UserName == undefined || this.UserName == null){
      toastr.info('UserName Cannot Be Blank','');
      return false
    }
    if(this.UserPassword == '' || this.UserPassword == undefined || this.UserPassword == null){
      toastr.info(' Password Cannot Be Blank','');
      return false
    }
    return true
  }
  
  
  async onSubmit(event:any){
    if(this.formvalidation()== true){
      event.target.disabled = true;
      let response:any = await this.service.Login(this.UserName,this.UserPassword).catch(err=>{
        toastr.error(err.message,'');

      })
      if(response != undefined){
        if(response.Boolval == true){
          const authData = {
            UserName: response.userdata[0].UserName,
            Email: response.userdata[0].Email,
            token: response.Token
          };
          localStorage.setItem('currentUser', JSON.stringify(authData));
          event.target.disabled = false;
          this.router.navigate([''])
        }else{
          toastr.error(response.returnerror,'');
          event.target.disabled = false;
  
        }
    }
  }
  }


  register(){
    this.router.navigate(['/Register'])

  }
  
  ForgotPassword(){
    this.router.navigate(['/ForgotPassword'])

  }
}
