import type { Role } from '../entities/user.entity';

export interface CreateUserDto {
  email: string;
  password: string;
  username: string;
  role: Role;
  profileImg?: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;
