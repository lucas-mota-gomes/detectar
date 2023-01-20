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
      const response = await client.collection('requests').getFullList(200 ,{
        expand: 'user,speciality,detective',
        filter: 'user.id = "' + this.sessionService.getUser().id + '"'
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getAllRequests() {
    try {
      const response = await client.collection('requests').getFullList(200 ,{
        expand: 'speciality',
        sort: '-status',
        '$autoCancel': false
      });
      let dados = response;
      for (const iterator of dados as any) {
        const userId = iterator.user as string;
        const user = await client.collection('users').getOne(userId);
        iterator['expand']['user'] = user;
        if(iterator.detective.length > 0){
          const detective = await client.collection('users').getOne(iterator.detective);
          iterator['expand']['detective'] = detective;
        }
      }
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getPaidRequests() {
    try {
      const response = await client.collection('requests').getFullList(200 ,{
        expand: 'user,speciality,detective',
        filter: 'user.id = "' + this.sessionService.getUser().id + '" && status > 0'
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  getDetectiveRequests() {
    try {
      const response = client.collection('requests').getFullList(200 ,{
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
      const response = await client.collection('requests').getFullList(200 ,{
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

  async getRequest(id: any) {
    try {
      const response = await client.collection('requests').getOne(id, {
        expand: 'user,speciality,detective'
      }) as any;
      if(response.detective){
        response["expand"].detective = await client.collection('users').getOne(response.detective);
      }
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

  async getDetectives(speciality: any){
    try {
      const response = await client.collection('users').getFullList(200, {
        filter: 'type = "detetive" && speciality ~ "' + speciality +'"'
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
