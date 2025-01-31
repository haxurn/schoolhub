  declare module "express-ip" {
    import { Request, Response, NextFunction } from "express";

    interface IpMiddleware {
        (req: Request, res: Response, next: NextFunction): void;
    }

    const ipMiddleware: IpMiddleware;
    export default ipMiddleware;
  }