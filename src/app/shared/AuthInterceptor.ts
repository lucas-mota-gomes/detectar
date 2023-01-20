import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("🚀 ~ file: interceptor.ts:9 ~ AuthInterceptor ~ intercept ~ req", req)
    // Obtém o token de autorização armazenado
    let token = localStorage.getItem('pocketbase_auth') as string;
    token = JSON.parse(token) as any;
    token = (token as any).token;

    // Verifica se o token existe
    if (token) {
      // Clona a requisição original e adiciona o cabeçalho de autorização
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `${token}`)
      });

      // Passa a requisição modificada para o próximo manipulador
      return next.handle(authReq);
    } else {
      // Passa a requisição original para o próximo manipulador
      return next.handle(req);
    }
  }
}



