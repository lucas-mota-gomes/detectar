import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import PocketBase from 'pocketbase';
import { environment } from 'src/environments/environment';
const client = new PocketBase(environment.pocketBaseUrl);
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // Observable string sources
  private user = new Subject<any>();

  user$ = this.user.asObservable();

  constructor(private router: Router, private http: HttpClient,) { }

  public async login(email: string, password: string) {
    try {
      const response = await client.collection('users').authWithPassword(email, password);
      if(response.record['type'] == 'detetive' && !response.record['active']){
        localStorage.clear();
        throw new Error('Usuário desativado');
      }
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  public async disableUser(userId: string, status:boolean) {
    try {
      const response = await client.collection('users').update(userId, { active: status });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  getUser() {
    const user = localStorage.getItem('pocketbase_auth') != null ? JSON.parse(localStorage.getItem('pocketbase_auth') as string).model : undefined;
    if(user){
      user.avatar = user.avatar ? user.avatar : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
      user.email = JSON.parse(localStorage.getItem('pocketbase_auth') as string).model.email;
    }
    return user;
  }

  public async register(user: any) {
    const userAuth = {
      email: user.email,
      password: user.password,
      passwordConfirm: user.password
    };

    const userProfile = {
      name: user.name,
      cpf: user.cpf,
      rg: user.RG,
      address: user.address,
      celular: user.celular,
      speciality: user.speciality,
      description: user.description,
      type: user.type,
      email: user.email,
      password: user.password,
      passwordConfirm: user.password
    };

    try {
      const user = await client.collection('users').create(userProfile);

      await client.collection('users').authWithPassword(userAuth.email, userAuth.password);

      return user;
    }
    catch (error) {
      throw error;
    }
  }

  public async logout() {
    try {
      localStorage.clear();
      this.router.navigate(['/acesso/login']);
    }
    catch (error) {
      throw error;
    }
  }

  public async getCep(cep: string) {
    try {
      const response = this.http.get(`https://viacep.com.br/ws/${cep}/json/`).toPromise();
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  public async resetPass(email: string) {
    try {
      const response = await client.collection('users').requestPasswordReset(email);
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}
