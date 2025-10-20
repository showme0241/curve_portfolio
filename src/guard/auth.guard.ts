/* eslint-disable @typescript-eslint/consistent-type-imports */
import { EXCEPTION_MESSAGE } from '@constants/messages';
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { dayjsKST } from '@utils/initDayJs';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // eslint-disable-next-line class-methods-use-this
  async isValidSession(req: Request) {
    const { session, sessionID } = req;

    if (!session || !sessionID) {
      throw new HttpException(EXCEPTION_MESSAGE.unauthorized.message, EXCEPTION_MESSAGE.unauthorized.status);
    }

    const { cookie } = session;
    const expires = cookie?.expires;

    if (!expires || dayjsKST(expires).isBefore(dayjsKST())) {
      throw new HttpException(EXCEPTION_MESSAGE.forbidden.message, EXCEPTION_MESSAGE.forbidden.status);
    }
  }

  // 진입점 컨텍스트
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    await this.isValidSession(req);
    return true;
  }
}
