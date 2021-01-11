import { injectable, inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import { BadRequestError, MissingFieldError } from '../errors/app.errors';
import StaticStringKeys from '../utils/constants';
import { UserUpdatePasswordDTO } from '../dto/user.dto';
import { IUserService } from '../services/user.service';
import { TYPES } from '../configs/types';
import logger from '../utils/logger';
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt-nodejs";
import * as passport from "passport";
import { IUserRepository } from '../repositories/user.repository';

@injectable()
export default class UserController {
  @inject(TYPES.UserRepository) private userRepository: IUserRepository;
  @inject(TYPES.UserService) private userService: IUserService;

  private limit: number;
  
  constructor() {
    this.limit = 20;
  }

  public async save(req: Request, res: Response): Promise<void> {

    if (!req.body.username) {
      throw new MissingFieldError('username');
    }

    if (!req.body.password) {
      throw new MissingFieldError('password');
    }

    if (!isEmail(req.body.email)) {
      throw new BadRequestError(StaticStringKeys.INVALID_EMAIL);
    }

    if (!isLength(req.body.password.trim(), { min: 4, max: 20 })) {
      throw new BadRequestError(StaticStringKeys.INVALID_PASSWORD);
    }

    const userAddModel: any = {
      username: req.body.username,
      password: req.body.password
    };

    await this.userService.save(userAddModel);
    res.sendStatus(201);
  }


  public async find(req: Request, res: Response): Promise<void> {
    if(req.query.data){
      if (Array.isArray(req.query.data)) {
      }
    }
    const limit = req.query.limit ? parseInt(req.query.data['limit']) : this.limit;
    const pageNumber = req.query.page ? parseInt(req.query.data['page']) : 1;

    res.send({
      pageNumber,
      limit,
      filter: req.query.data['filter'],
      path: req.path
    });
  }

  public async get(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    const user = await this.userRepository.get(1);
    res.send(user);
  }

  public async getByEmail(req: Request, res: Response): Promise<void> {
    
    if (!req.query.username) {
      throw new MissingFieldError('username');
    }

    const username = req.query.username ? req.query.username : "";
    logger.info("username======"+username)
    const user: any = await this.userService.getByEmail(username.toString());

    res.send(user);
  }

  /**
   * Update password
   */
  public async updatePassword(req: Request, res: Response) {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    if (!req.body.password) {
      throw new MissingFieldError('password');
    }

    const updatePasswordDto: UserUpdatePasswordDTO = {
      id: Number.isInteger(req.params.id) ? parseInt(req.params.id,) : 9999999999999,
      password: req.body.password
    };

    await this.userService.updatePassword(updatePasswordDto);

    res.sendStatus(204);
  }

  public async update(_req: Request, _res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public async delete(_req: Request, _res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async registerUser(req: Request, res: Response): Promise<void> {

    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
   
    const userAddModel: any = {
      username: req.body.username,
      password: hashedPassword
    };

    const user = await this.userService.save(userAddModel);

    const token = jwt.sign({ username: req.body.username, scope : req.body.scope }, process.env.JWT_SECRET);
    res.status(201).send({ token: token, user: user });
  }

  public authenticateUser(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", function (err, user) {
      if (err || !user) {
        return res.status(401).json({ status: "error", data: "Invalid user!" });
      } else {
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
         return res.status(200).send({ token: token });
      }
    })(req, res, next);
}


}
