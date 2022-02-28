import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Configuration } from '../../app.constants';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  router: any;

  constructor(private http: HttpClient) {
    localStorage.getItem('username');
  }

  authenticate(user: User): Observable<boolean> {
    var headers_object = new HttpHeaders();
    headers_object.append('Content-Type', 'application/json');
    headers_object.append(
      'Authorization',
      'Basic ' + btoa('username:password')
    );
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic',
      }),

      observe: 'response' as 'response',
      withCredentials: true,
    };

    return this.http
      .post<any>(Configuration.serverAuthUrl, user, httpOptions)
      .pipe(
        map((data) => {
          if (data.status == 200) {
            localStorage.setItem('username', user.userName);
            localStorage.setItem('authdata', data.body.Authorization);
            console.log(data.body);
            return true;
          }
          return false;
        })
      );
  }

  logOut(): void {
    localStorage.setItem('username', null);
    localStorage.removeItem('username');
    localStorage.setItem('authdata', null);
  }
}
