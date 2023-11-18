import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
  HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService  implements HttpInterceptor{

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // You can do something with the request before it is sent
    console.log('Intercepted Request:', request);

    // Modify the request if needed
    // For example, you can add headers or authentication tokens
   
    const modifiedRequest = request.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept':'X-Auth-Token'  ,
      }),
    });

    // Pass the modified request to the next handler
    return next.handle(modifiedRequest)
      .pipe(
        // You can also handle the response if needed
        // For example, you can log the response
        tap(event => {
          if (event.type === HttpEventType.Response) {
            console.log('Intercepted Response:', event);
          }
        })
      );
  }
}
