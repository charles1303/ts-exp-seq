import { inject, injectable } from "inversify";
import { TYPES } from "../configs/types";
import { IRoleRepository } from "../repositories/role.repository";

export interface IRoleService {
    createRole(data: any): Promise<any>;
 }


 @injectable()
export default class RoleService implements IRoleService {

    @inject(TYPES.RoleRepository) private roleRepository: IRoleRepository;

     createRole(data: any): Promise<any> {
        return this.roleRepository.save(data).then(role => {
            return role;
           })
           .catch((err: Error) => {throw err});
     }

}