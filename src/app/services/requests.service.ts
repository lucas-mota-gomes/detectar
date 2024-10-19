import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';
const client = new PocketBase(environment.pocketBaseUrl);

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private sessionService: SessionService) { }

  async getRequests() {
    try {
      const response = await client.collection('requests').getFullList(200, {
        expand: 'user,speciality,detective',
        filter: 'user.id = "' + this.sessionService.getUser().id + '"'
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getAllRequests(filter?: string) {
    console.log("🚀 ~ RequestsService ~ getAllRequests ~ filter:", filter)
    let options: any = {
      expand: 'speciality,user,detective',
      sort: '-created',
      '$autoCancel': false
    }
    if(filter){
      options = {
        expand: 'speciality,user,detective',
        sort: '-status',
        filter: filter,
        '$autoCancel': false
      }
    }
    try {
      const response = await client.collection('requests').getFullList(200, options);
      let dados = response;
      console.log("🚀 ~ RequestsService ~ getAllRequests ~ dados:", dados)
      // for (const iterator of dados as any) {
      //   const userId = iterator.user as string;
      //   const user = await client.collection('users').getOne(userId);
      //   iterator['expand']['user'] = user;
      //   if (iterator.detective.length > 0) {
      //     const detective = await client.collection('users').getOne(iterator.detective);
      //     iterator['expand']['detective'] = detective;
      //   }
      // }
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getPaidRequests(filtro?: string) {
    let filter = 'user.id = "' + this.sessionService.getUser().id + '" && status > 0';
    if(filtro){
      filter = 'user.id = "' + this.sessionService.getUser().id + '" && status > 0 && '+ filtro;
    }
    try {
      const response = await client.collection('requests').getFullList(200, {
        expand: 'user,speciality,detective',
        filter: filter
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  getDetectiveRequests() {
    try {
      const response = client.collection('requests').getFullList(200, {
        expand: 'user,speciality,detective',
        filter: 'detective.id = "' + this.sessionService.getUser().id + '"'
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getFileUrl(id: any, fileName: string) {
    try {
      const record = await client.collection('requests').getOne(id);
      const response = client.getFileUrl(record, fileName);
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getPendingRequests() {
    try {
      const response = await client.collection('requests').getFullList(200, {
        expand: 'user,speciality,detective',
        filter: 'user.id = "' + this.sessionService.getUser().id + '" && status = 0',
        '$autoCancel': false
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async newRequest(request: any) {
    try {
      const response = await client.collection('requests').create(request);
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getRequest(id: any, filter?: any) {
    let filtro = "";
    if(filter){
      filtro = filter;
    }
    try {
      const response = await client.collection('requests').getOne(id, {
        expand: 'user,speciality,detective',
        filter: filtro
      }) as any;
      if (response.detective) {
        response["expand"].detective = await client.collection('users').getOne(response.detective);
      }
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getSpecialty(id: any) {
    try {
      const response = await client.collection('specialities').getOne(id) as any;
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async updateRequest(id: any, request: any) {
    try {
      const response = await client.collection('requests').update(id, request);
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getDetectives(speciality: any) {
    try {
      const response = await client.collection('users').getFullList(200, {
        filter: 'type = "detetive" && speciality ~ "' + speciality + '"'
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getAllDetectives() {
    try {
      const response = await client.collection('users').getFullList(200, {
        filter: 'type = "detetive"',
        expand: 'speciality',
        sort: '+name'
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async deleteRequest(id: any) {
    try {
      const response = await client.collection('requests').delete(id);
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}
