// core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const addToken = (request: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  };

  const handle401Error = (request: HttpRequest<unknown>): Observable<unknown> => {
    if (isRefreshing) {
      return refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next(addToken(request, token!)))
      );
    }

    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(res => {
        isRefreshing = false;
        const newToken = res.data?.accessToken ?? '';
        refreshTokenSubject.next(newToken);
        return next(addToken(request, newToken));
      }),
      catchError(err => {
        isRefreshing = false;
        router.navigate(['/auth/login']);
        return throwError(() => err);
      })
    );
  };

  const token = authService.accessToken;
  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
        return handle401Error(req) as Observable<never>;
      }
      return throwError(() => error);
    })
  );
};
