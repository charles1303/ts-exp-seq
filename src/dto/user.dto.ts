
export interface UserCreateDTO {
  username: string;
  password: string;
}

export interface UserUpdatePasswordDTO {
  id: number;
  password: string;
}

export interface UserUpdateEmailDTO {
  id: number;
  newEmail: string;
}
