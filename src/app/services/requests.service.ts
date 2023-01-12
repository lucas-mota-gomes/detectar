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
      const response = await client.records.getFullList('requests', 200 ,{
        expand: 'user,speciality,detective',
        filter: 'user.id = "' + this.sessionService.getUser().id + '"'
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getPaidRequests() {
    try {

      const response = await client.records.getFullList('requests', 200 ,{
        expand: 'user,speciality,detective',
        filter: 'user.id = "' + this.sessionService.getUser().id + '" && status > 0'
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getPendingRequests() {
    try {

      const response = await client.records.getFullList('requests', 200 ,{
        expand: 'user,speciality,detective',
        filter: 'user.id = "' + this.sessionService.getUser().id + '" && status != 1'
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async newRequest(request: any) {
    try {
      const response = await client.records.create('requests', request);
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getRequest(id: any) {
    try {
      const response = await client.records.getOne('requests', id, {
        expand: 'user,speciality,detective'
      }) as any;
      if(response.detective){
        response["@expand"].detective = await client.records.getOne('profiles', response.detective);
      }
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async updateRequest(id: any, request: any) {
    try {
      const response = await client.records.update('requests', id, request);
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}
