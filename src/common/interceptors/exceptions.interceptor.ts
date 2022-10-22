import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataBaseConnectionException } from '../exceptions/DataBaseConnectionException';

@Injectable()
export class ExceptionsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        return throwError(() => {
          if (err.code === 'ECONNREFUSED') {
            throw new DataBaseConnectionException();
          }

          return err;
        });
      }),
    );
  }
}
