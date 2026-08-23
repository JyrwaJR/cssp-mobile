import { LoginT } from './login';

export type RoleT = 'USER' | 'MEMBER';

export interface UserT extends LoginT {}

export * from './login';
