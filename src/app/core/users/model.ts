import { PERMISSION_ENUM, ROLE_ENUM } from '../../shared/metadata';

export interface IGetUserSelfDTO {
  [key: string]: any;
  id: number;
  name: string;
  lastName: string;
  userName: string;
  age: number;
  email: string;
  phoneNumber: string;
  address: string;
}
export interface IUpdateUserSelfDTO {
  name: string;
  lastName: string;
  userName: string;
  age: number;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface IUserIdentity {
  userId: number;
  name: string;
  lastName: string;
  email: string;
  role: ROLE_ENUM;
  permissions: PERMISSION_ENUM[];
}

export interface IUserGetDTO {
  [key: string]: any;
  id: number;
  name: string;
  lastName: string;
  userName: string;
  age: number;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  role: ROLE_ENUM;
  permissions: PERMISSION_ENUM[];
}
export interface IUserUpdateDTO {
  name: string;
  lastName: string;
  userName: string;
  age: number;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  role: ROLE_ENUM;
  permissions: PERMISSION_ENUM[];
}
export interface IUserCreateDTO {
  name: string;
  lastName: string;
  userName: string;
  age: number;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  role: ROLE_ENUM;
  permissions: PERMISSION_ENUM[];
}
