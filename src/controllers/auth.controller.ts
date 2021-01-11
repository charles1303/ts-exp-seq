import { inject, injectable } from "inversify";
import { Request, Response } from 'express';
import { TYPES } from "../configs/types";
import { MissingFieldError } from "../errors/app.errors";
import { IAuthService } from "../services/diauth.service";

@injectable()
export class AuthController {

  @inject(TYPES.DiAuthService) private diAuthServiceInstance: IAuthService;

  public initialize(): any {

    return this.diAuthServiceInstance.initialize();
}

public checkIsUserInRole(allowedRoles: string[]) {
  return (req: { header: (arg0: string) => string; }, _res: any, next: () => any) => {
    this.diAuthServiceInstance.checkIsUserInRole(allowedRoles, req.header('Authorization'));
    return next();
 }
} 


public authenticate (callback: any): any {
    return this.diAuthServiceInstance.authenticate(callback);
}

  public async registerUser(req: Request, res: Response): Promise<any> {

    try {

      if (!req.body.username) {
        throw new MissingFieldError('username');
      }
  
      if (!req.body.password) {
        throw new MissingFieldError('password');
      }
  
      const userAddModel = {
        username: req.body.username,
        password: req.body.password
      };

      const response = await this.diAuthServiceInstance.registerUser(userAddModel, req.body.scope);

      res.status(201).send(response);
    } catch (error) {
      res.status(500).send({status: "error", data: "Error registering user"});
    }    
  }

  public async registerUserWithRoles(req: Request, res: Response): Promise<any> {

    try {

      if (!req.body.username) {
        throw new MissingFieldError('username');
      }
  
      if (!req.body.password) {
        throw new MissingFieldError('password');
      }

      if (!req.body.roles || !Array.isArray(req.body.roles)) {
        throw new MissingFieldError('roles');
      }
  
      const userAddModel = {
        username: req.body.username,
        password: req.body.password,
        roles: req.body.roles
      };

      const response = await this.diAuthServiceInstance.registerUserWithRoles(userAddModel, req.body.scope);

      res.status(201).send(response);
    } catch (error) {
      res.status(500).send({status: "error", data: "Error registering user with roles"});
    }    
  }

  public async login (req: Request, res: Response): Promise<any> {
    try {

      if (!req.body.username) {
        throw new MissingFieldError('username');
      }
  
      if (!req.body.password) {
        throw new MissingFieldError('password');
      }

      const userAddModel= {
        username: req.body.username,
        password: req.body.password
      };
  
      const response = await this.diAuthServiceInstance.login(userAddModel);
      res.status(200).send(response);

    } catch (err) {
        res.status(401).json({ "status": "error", "data": "Invalid credentials", "errors": err });
    }
  }
}

