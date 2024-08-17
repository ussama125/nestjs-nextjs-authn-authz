export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
}

export type Users = User[];

export interface UsersData {
  data: Users;
  page: number;
  size: number;
  count: number;
}

export type SessionUser = {
  access_token: string;
  firstName: string;
  lastName: string;
  email: string;
  id: number;
};

export type SessionType = {
  update: any;
  data: {
    expires: string;
    user: SessionUser;
  };
  status: "loading" | "authenticated" | "unathenticated";
};
