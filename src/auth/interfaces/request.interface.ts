import { IHeaders } from './headers.interface';

export interface IRequestWithUser extends Request {
  user: {
    email: string;
  };
  headers: IHeaders;
}
