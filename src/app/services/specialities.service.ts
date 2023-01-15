import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from 'src/environments/environment';
const client = new PocketBase(environment.pocketBaseUrl);

@Injectable({
  providedIn: 'root'
})
export class SpecialitiesService {

  constructor() { }

  async getSpecialities() {
    try {
      const response = await client.collection('specialities').getFullList(200);
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async editSpeciality(id: string, data: any) {
    try {
      const response = await client.collection('specialities').update(id, data);
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async createSpeciality(data: any) {
    try {
      const response = await client.collection('specialities').create(data);
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async deleteSpeciality(id: string) {
    try {
      const response = await client.collection('specialities').delete(id);
      return response;
    }
    catch (error) {
      throw error;
    }
  }

  async getImageUrl(filename: any){
    try {
      const response = await client
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}
