/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import type { FindOneOptions, Repository } from 'typeorm';
import type { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { EXCEPTION_MESSAGE } from '@constants/messages';
import type { PaginationDTO } from '@type/dto';
import * as bcrypt from 'bcryptjs';
import { Log } from './entities/log.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async createUser(registerUser: CreateUserDto) {
    const findUser = await this.search({ where: { email: registerUser.email } });

    if (findUser) {
      throw new HttpException(EXCEPTION_MESSAGE.alreadyExist.message, EXCEPTION_MESSAGE.alreadyExist.status);
    }

    registerUser.password = await this.transformPassword(registerUser.password);
  }

  async findUsers(query: PaginationDTO<Record<string, any>, Record<string, any>>) {
    const { page, limit, option, sort } = query;
    const where: Record<string, any> = {};

    if (option) {
      for (const [key, value] of Object.entries(option)) {
        if (value !== undefined && value !== null && value !== '') {
          where[key] = value; // 조건 처리 추출할 케이스 : 사용자 등급 ...
        }
      }
    }

    const [data, total] = await this.userRepository.findAndCount({
      where,
      skip: (Number(page) - 1) * Number(limit),
      order: { ...sort },
      take: Number(limit),
      relations: ['group', 'authLog'],
    });

    return {
      data,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async updateUser(userIdx: number, updateUser: UpdateUserDto) {
    const findUser = await this.search({ where: { email: updateUser.email } });

    if (!findUser) {
      throw new HttpException(EXCEPTION_MESSAGE.notFound.message, EXCEPTION_MESSAGE.notFound.status);
    }

    const updateField: Partial<User> = {};
    let isUpdated = false;

    for (const [key, value] of Object.entries(updateUser)) {
      if (value !== undefined && value !== null && findUser[key] !== value) {
        updateField[key] = value;
        isUpdated = true;
      }
    }

    if (!isUpdated) {
      throw new HttpException(EXCEPTION_MESSAGE.isSameInsert.message, EXCEPTION_MESSAGE.isSameInsert.status);
    }
  }

  async deleteUser(userIdx: number) {
    const findUser = await this.search({ where: { idx: userIdx } });

    if (!findUser) {
      throw new HttpException(EXCEPTION_MESSAGE.notFound.message, EXCEPTION_MESSAGE.notFound.status);
    }
  }

  async search(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  async transformPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
