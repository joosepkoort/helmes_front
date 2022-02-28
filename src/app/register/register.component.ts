import { Component, OnInit } from '@angular/core';

import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Configuration } from 'src/app/app.constants';
import { MessageService } from '../shared/message.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username = '';
  password = '';
  email = '';
  invalidLogin = false;
  http: any;
  actor_name: any;
  usernamefieldverifcation: string = '';
  passwordfieldverification: string = '';
  constructor(private httpClient: HttpClient, private messageService: MessageService) {}
  ngOnInit() {}

  usernameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(20),
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(20),
  ]);

  matcher = new MyErrorStateMatcher();

  registerUser() {
    if (this.usernameFormControl.valid && this.passwordFormControl.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'response' as 'response',
        body: {
          userName: this.username,
          password: this.password,
        },
        withCredentials: false,
      };

      this.httpClient
        .post(Configuration.serverRegisterUrl, httpOptions.body, {
          observe: 'response' as 'response',
        })
        .subscribe(
          (data) => {
            if (data.status == 200) {
              this.username = '';
              this.password = '';
              let response = data.body;
              if (response == false) {
                this.messageService.displayMessage("User already exists", "error");
              } else {
                this.messageService.displayMessage("Registration succeeeded", "success");
              }
            } else {
              this.messageService.displayMessage("Registration failed", "error");
            }
          },
          (err: HttpErrorResponse) => {
            this.messageService.displayMessage("Registration failed", "error");
            console.log(err.message);
          }
        );
    } else {
      this.usernameFormControl.markAsTouched();
      this.passwordFormControl.markAsTouched();
    }
  }
}
