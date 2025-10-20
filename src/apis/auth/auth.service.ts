/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { Log } from '../user/entities/log.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
    private readonly userService: UserService,
  ) {}
}
