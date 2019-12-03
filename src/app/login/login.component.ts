import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../localStorageService';
import { Router } from '@angular/router';
import { importType } from '@angular/compiler/src/output/output_ast';
import { ToastService } from '../toast/toast.service';
import { Contact } from '../contact/contact.model';

export interface IUser {
  id?: number;
  username: string;
  password: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: IUser = { username: '', password: '' };
  localStorageService: LocalStorageService<IUser>;
  currentUser: IUser = null;
  constructor(private router: Router, private toastSerive: ToastService) {
    this.localStorageService = new LocalStorageService('user');
  }

  ngOnInit() {
    this.currentUser = this.localStorageService.getItemsFormLoacalStorage();
    if (this.currentUser != null) {
      this.router.navigate(['contacts'])

    }
  }

  login(user: IUser) {
    const defaultUser: IUser = { username: 'Chue', password: '123' };
    if (user.username !== '' && user.password !== '') {
      if (user.username === defaultUser.username && user.password === defaultUser.password) {
        // login user and store in loaclSorage then naivgate to contacts app
        this.localStorageService.saveItemsToLocalStorage(user);
        this.router.navigate(['contacts', user]);
      } else {
        this.toastSerive.showToast('warning', 2000, 'Login failed! Please check your username or password');
      }
    } else {
      this.toastSerive.showToast('warning', 2000, 'Login failed! Please specify user and password!');

    }
  }
}

