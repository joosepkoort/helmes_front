import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { MessageService } from 'src/app/shared/message.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService {
  constructor(
    private router: Router,
    private authservice: AuthenticationService,
    private messageService: MessageService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.messageService.displayMessage('Token expired', 'error');
            this.router.navigate(['login']);
            this.authservice.logOut();
          }
        }
      )
    );
    {
    }
  }
}
