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
      const response = await client.records.getFullList('specialities', 200);
      return response;
    }
    catch (error) {
      throw error;
    }
  }
}
