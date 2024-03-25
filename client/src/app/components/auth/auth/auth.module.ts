import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from '../homepage/homepage.component';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';



@NgModule({
  declarations: [  HomepageComponent,
    LoginComponent,
    SignupComponent],
  imports: [
    CommonModule,

  ]
})
export class AuthModule { }
