import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from 'src/environments/environment';
const client = new PocketBase(environment.pocketBaseUrl);

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor() { }

  async getRequests() {
    try {
      const response = await client.records.getFullList('requests', 200 ,{
        expand: 'user,speciality,detective'
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
      });
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}
