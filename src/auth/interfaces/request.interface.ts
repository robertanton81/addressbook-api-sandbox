export interface IRequestWithUser extends Request {
  auth: {
    email: string;
  };
}
