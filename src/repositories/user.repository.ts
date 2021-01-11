
import { injectable } from "inversify";
import logger from "../utils/logger";
import { BaseRepository } from "./base.repository";
const User = require('../models').User;

export interface IUserRepository extends BaseRepository{
  get(id: number): Promise<any>;
  getByEmail(email: string): Promise<any>;
}

@injectable()
export class UserRepository implements IUserRepository {
    exists(t: number): Promise<boolean> {
      throw new Error("Method not implemented."+t);
    }
    delete(t: number): Promise<any> {
      throw new Error("Method not implemented."+t);
    }
    save(t: any): Promise<any> {
      const user = User.build({ username: t.username, password: t.password});
      return User.create({ username: user.username, password: user.password})
      // .then(u => {
      //   return u.get({ plain: true });
      // })
      .catch(err => {
        logger.error(`Error saving user in repository!`+ err + "****"+ t.username+ "*****t.username");
      })
  
    }
    findAll(): Promise<any[]> {
      return User.findAll({})
    .then((users: Array<any>) => (users))
    .catch((err: Error) => {throw err});
    }

    get(id: number): Promise<any> {

      return User.findByPk(id).then((user: any) => (user))
      .catch((err: Error) => {throw err});
    }

    getByEmail(username: string): Promise<any> {

      return User.findOne({ where: { username } }).
      then((user: any) => (user))
      .catch((err: Error) => {throw err});
    }

}