import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { User } from 'src/app/core/models/user';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username:string = '';
  password:string = '';
  invalidLogin:boolean = false;

  constructor(
    private router: Router,
    @Inject(AuthenticationService) private loginservice: AuthenticationService,
    private snackBar: MatSnackBar, private messageService: MessageService
  ) {}

  ngOnInit() {}
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);

  checkLogin(): void {
    let user: User = {
      userName: this.username,
      password: this.password,
    };
    if (this.usernameFormControl.valid && this.passwordFormControl.valid) {
      this.loginservice
        .authenticate(user)
        .pipe(first())
        .subscribe(
          (data) => { 
            this.router.navigate(['main']);
            this.invalidLogin = false;
            this.messageService.displayMessage("Auth successful","success");
          },
          (error) => {
            this.invalidLogin = true;
            this.messageService.displayMessage("Auth unsuccessful","error");
          }
        );
    } else {
      this.usernameFormControl.markAsTouched();
      this.passwordFormControl.markAsTouched();
    }
  }
}
