import { Request, Response } from 'express';

export interface TypedRequest<T> extends Request {
  body: T;
}

export interface TypedResponse<T> extends Response {
  json: (body: T) => TypedResponse<T>;
}

export type RequestHandler<T = any, U = any> = (
  req: TypedRequest<T>,
  res: TypedResponse<U>,
  next: Function
) => void; 