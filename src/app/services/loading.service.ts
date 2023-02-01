import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  constructor() {}

  showLoading() {
    setTimeout(() => {
      this._loading.next(true);
    }, 100);
  }

  hideLoading() {
    setTimeout(() => {
      this._loading.next(false);
    }, 100);
  }

}
