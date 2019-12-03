import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { Http } from '@angular/http';
import { LocalStorageService } from '../localStorageService';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../login/login.component';
import { Router } from "@angular/router"
import { ToastService } from '../toast/toast.service';


@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<Contact> = [];
  contactParams = '';
  localSorageSerive: LocalStorageService<Contact>;
  currentUser: IUser;

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.localSorageSerive = new LocalStorageService('contacts');
  }

  async ngOnInit() {
    const currentUser = this.localSorageSerive.getItemsFormLoacalStorage('user');
    if (currentUser == null) {
      this.router.navigate(['login']);
    }
    this.loadContacts();
    this.activatedRoute.params.subscribe((data: IUser) => {
      console.log('data passed from login component', data);
      this.currentUser = data;
    })
  }

  async loadContacts() {
    const savedContacts = this.getItemsFormLoacalStorage('contacts');
    if (savedContacts && savedContacts.length > 0) {
      this.contacts = savedContacts;
    } else {
      this.contacts = await this.loadItemsFromFile();
    }
    this.sortByID(this.contacts);
  }

  async loadItemsFromFile() {
    const data = await this.http.get('assets/contacts.json').toPromise();
    return data.json();
  }

  addContact() {
    this.contacts.unshift(new Contact({
      id: null,
      firstName: null,
      lastName: null,
      phone: null,
      email: null
    }));



  }

  deleteContact(index: number) {
    this.contacts.splice(index, 1);
    this.saveItemsToLocalStorge(this.contacts);
  }

  saveContact(contact: any) {
    let hasError: boolean = false;
    Object.keys(contact).forEach((key: any) => {
      if (contact[key] == null) {
        hasError = true;
        this.toastService.showToast('danger', 2000, `Saved failed! property ${key} must not be null!`);
      }
    })
    if (!hasError) {
      contact.editing = false;
      this.saveItemsToLocalStorge(this.contacts);
    }
  }

  saveItemsToLocalStorge(contacts: Array<Contact>) {
    contacts = this.sortByID(contacts);
    this.localSorageSerive.saveItemsToLocalStorage(contacts);
    // const saveContacts = localStorage.setItem('contacts', JSON.stringify(contacts));
    // return this.saveContact;
  }

  getItemsFormLoacalStorage(key: string) {
    const savedContacts = JSON.parse(localStorage.getItem(key));
    return this.localSorageSerive.getItemsFormLoacalStorage();
    // return savedContacts;
  }

  searchContact(params: string) {


    this.contacts = this.contacts.filter((item: Contact) => {
      const fullName = item.firstName + ' ' + item.lastName;
      if (params === fullName || params === item.firstName || params === item.lastName) {
        return true;
      } else {
        return false;
      }
    });
  }

  sortByID(contacts: Array<Contact>) {
    contacts.sort((prevContact: Contact, presContact: Contact) => {
      return prevContact.id > presContact.id ? 1 : -1;
    });
    return contacts;
  }

  logout() {
    this.localSorageSerive.clearItemFromLocalStorage('user');
    this.router.navigate(['']);
  }
}
