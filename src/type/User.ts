export interface UserList {
  user_id: number;
  username: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface UserRequest {
  username: string;
  fullName: string;
  role: string;
  password: string;
}

export interface UserUpdateRequest {
  id: number;
  username: string;
  fullName: string;
  role: string;
}
