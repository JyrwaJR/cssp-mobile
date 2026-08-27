import { LoginT } from './login';

export type RoleT = 'USER' | 'MEMBER';

export interface UserT extends LoginT {
  ppo_no: string;
  phone_no?: string;
  organization?: string;
}

export * from './login';
