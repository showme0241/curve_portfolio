/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { BaseResponse } from '@type/response';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
  // eslint-disable-next-line class-methods-use-this
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<BaseResponse<T>> | Promise<Observable<BaseResponse<T>>> {
    return next.handle().pipe(
      map((data: any) => {
        const response: Response = context.switchToHttp().getResponse<Response | any>();
        const request: Request = context.switchToHttp().getRequest<Request>();
        const status = response.statusCode ?? HttpStatus.OK;
        const { session } = request;

        if (session?.user) {
          const { role, userIdx } = session.user;

          return {
            status,
            user: {
              idx: userIdx,
              role,
            },
            result: data,
          };
        }
      }),
    );
  }
}
