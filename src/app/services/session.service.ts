import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import PocketBase from 'pocketbase';
import { environment } from 'src/environments/environment';
const client = new PocketBase(environment.pocketBaseUrl);
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // Observable string sources
  private user = new Subject<any>();

  user$ = this.user.asObservable();

  constructor(private router: Router) { }

  public async login(email: string, password: string) {
    try {
      const response = await client.users.authViaEmail(email, password);
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  getUser() {
    const user = localStorage.getItem('pocketbase_auth') != null ? JSON.parse(localStorage.getItem('pocketbase_auth') as string).model.profile : undefined;
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
      type: user.type
    };

    try {
      const user = await client.users.create(userAuth);

      await client.users.authViaEmail(userAuth.email, userAuth.password);

      const updatedProfile = await client.records.update('profiles', user?.profile?.id as string, userProfile);

      return updatedProfile;
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
}
