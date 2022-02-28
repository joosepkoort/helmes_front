import { AuthenticationService } from './core/auth/authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from './shared/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Helmes';

  constructor(
    private loginService: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onLogout() {
    this.loginService.logOut();
    this.messageService.displayMessage("Logged out","success")
  }
  isMainRoute() {
    return this.router.url === '/main';
  }
}
