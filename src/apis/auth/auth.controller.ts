/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/join')
  async join(@Body() req: CreateUserDto) {
    return this.userService.createUser(req);
  }

  // @Post('/login')
  // async login() {}

  // @Post('/logout')
  // async logout() {}
}
