import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt-token');
  if (!token) return next(req);
  
  const cpy = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(cpy);
};
