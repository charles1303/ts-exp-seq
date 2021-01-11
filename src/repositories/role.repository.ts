
import { injectable } from "inversify";
import logger from "../utils/logger";
const Role = require('../../src/models').Role;

export interface IRoleRepository {
    save(data: any): Promise<any>;
    getRoleByName(data: string): Promise<any>;
 }


 @injectable()
export class RoleRepository implements IRoleRepository {
    getRoleByName(data: string): Promise<any> {
        return Role.findOne({ where: {name: data} })
        .then(role => {
            return role;
           })
           .catch((err: Error) => {throw err});
    }
    save(data: any): Promise<any> {
        return Role.create({ name: data.name })
        .then(role => {
            //return role.get({ plain: true });
            return role;
           }).catch((err: Error) => {logger.error("error saving in role repositiory====="+err)}); 
     }

}