import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // API path
  server = 'https://jsonplaceholder.typicode.com/';
  mydefault_request_timeout = 30000;


  constructor(private http: HttpClient, @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number) {

    console.log("Auth Request loaded...");

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutValue = req.headers.get('timeout') || this.defaultTimeout;
    const timeoutValueNumeric = Number(timeoutValue);

    return next.handle(req).pipe(timeout(timeoutValueNumeric));
  }

  post_without_tokens(credentials: any, type: string) {
    const headers = new HttpHeaders({ timeout: `${this.mydefault_request_timeout}` });
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return new Promise((resolve, reject) => {
      this.http.post(this.server + type, JSON.stringify(credentials), { headers: headers })
        .pipe(retry(2))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  get_without_tokens(type: string) {
    const httpHeader = {
      headers: new HttpHeaders(
        {
          timeout: `${this.mydefault_request_timeout}`,
          'Accept': '*',
          'Content-Type': 'application/json'

        })
    };
    return new Promise((resolve, reject) => {
      this.http.get(this.server + type, httpHeader)
        .pipe(retry(2))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


}
