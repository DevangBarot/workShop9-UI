import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(key: string) {
    return this.decryptData(localStorage.getItem(key));
  }

  setItem(key: string, value: string) {
    value = this.encryptData(value);
    localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }
  checkItemExists(key: string) {
    if (this.getItem(key)) {
      return true;
    }
    return false;
  }
  removeAll() {
    localStorage.clear();
  }
  encryptData(value:any) {
    return AES.encrypt(JSON.stringify(value), 'Shop').toString();
  }
  decryptData(value:any) {
    if (value != null && value != '') {
      let bytes = AES.decrypt(value.toString(), 'Shop');
      return JSON.parse(bytes.toString(enc.Utf8));
    }
    else {
      return value;
    }
  }
}
