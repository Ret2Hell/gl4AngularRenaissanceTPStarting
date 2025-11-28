import { Injectable } from '@angular/core';
import { faker } from '@faker-js/faker';
import { List } from 'immutable';
export interface User {
  name: string,
  age: number
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: List<User> = List();
  constructor() {
    for (let i = 0; i<50; i++)
      this.users = this.users.push({
        name: faker.name.fullName(),
        age: faker.datatype.number({min: 18, max: 30})
      });
  }
  getOddOrEven(isOdd = false): List<User> {
    return this.users.filter((user) => !!(user.age % 2) == isOdd );
  }
  addUser(list: List<User>, name: string) {
    return {
      name,
      age: faker.datatype.number({min: 18, max: 30})
    };
  }
}
