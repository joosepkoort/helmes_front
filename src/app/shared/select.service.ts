import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../app.constants';
import { Data } from '../core/models/data';

@Injectable({
  providedIn: 'root',
})
export class SelectService {
  constructor(private http: HttpClient) {}

  getTree(): Observable<string> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'text/plain; charset=utf-8')
      .set('Authorization', localStorage.getItem('authdata'));
    return this.http.get(Configuration.overallData, {
      headers,
      responseType: 'text',
    });
  }

  getData(): Observable<Data>{
    const headers = new HttpHeaders()
      .set('Content-Type', 'text/plain; charset=utf-8')
      .set('Authorization', localStorage.getItem('authdata'));

    return this.http.get<Data>(Configuration.personalData, {
      headers,
      responseType: 'json',
    });
  }

  updateData(data: Data): Observable<Data> {
    const headers = { Authorization: localStorage.getItem('authdata') };
    const body = {
      name: data.name,
      selectedSectors: data.selectedSectors,
      agreedToTerms: data.agreedToTerms,
    };
    return this.http.post<Data>(Configuration.updateData, body, { headers });
  }
}
