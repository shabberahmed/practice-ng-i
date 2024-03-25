import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('https://fakestoreapi.com/productsqqq')) {
      console.log("Intercepted request to https://fakestoreapi.com/products");
      return next.handle(request);
    } else {
      console.log("No access to this URL");
      // Return the intercepted request and handle any errors from the API
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error) {
            console.error('Unauthorized access to API',error);
            // Handle unauthorized access error, such as redirecting to login
          }
          return throwError(error);
        })
      );
    }
  }
}
