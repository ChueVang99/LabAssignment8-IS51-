import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toastChanged: Subject<any> = new Subject<any>();
  constructor() { }

  showToast(type: string, timeout: number, message: string) {
    this.toastChanged.next({
      type: type, timeout: timeout, message: message
    });
  }
}
