import { injectable, inject } from "inversify";
import * as bcrypt from 'bcrypt';
import { UserCreateDTO, UserUpdatePasswordDTO, UserUpdateEmailDTO } from '../dto/user.dto';
import { TYPES } from '../configs/types';
import { IRoleRepository } from "../repositories/role.repository";
import logger from "../utils/logger";
import { IUserRepository } from "../repositories/user.repository";

/**
 * User without sensitive fields.
 * This is useful when returning data to client.
 */
//export type NormalizedUserDocument = Pick<UserDocument, '_id' | 'username' | 'email' | 'lastLoggedIn'>;

/**
 * Interface for UserService
 */
export interface IUserService {
  createUser(data: UserCreateDTO): Promise<void>;
  updateEmail(data: UserUpdateEmailDTO): Promise<void>;
  updatePassword(data: UserUpdatePasswordDTO): Promise<void>;
  isValidPassword(userGivenPassword: string, storedPassword: string): Promise<boolean>;
  normalizeEmail(email: string): string;
  normalizeUsername(username: string): string;
  isValidUsername(username: string): boolean;
  isUsernameAvailable(username: string): Promise<boolean>;
  isEmailAvailable(givenEmail: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  save(t: any): Promise<any>;
  getByEmail(email: string): Promise<any>;
  saveUserWithRoles(user: any, roles: any[]): Promise<any>;
}

/**
 * The actual class that contains all the business logic related to users.
 * Controller sanitize/validate(basic) and sends data to this class methods.
 */
@injectable()
export default class UserService implements IUserService {
  
  @inject(TYPES.UserRepository) private userRepository: IUserRepository;

  @inject(TYPES.RoleRepository) private roleRepository: IRoleRepository;

  getByEmail(username: string): Promise<any> {

    
    return this.userRepository.getByEmail(username).then(user => {
      return {
        id: user.id,
        username: user.username
      };
  
    })
    .catch((err: Error) => {throw err}); 
  }

  async saveUserWithRoles(user: any, roles: any[]): Promise<any> {

    Promise.all([
      await this.saveRoles(roles),
      this.userRepository.save(user)
  ])
  
  .then(([roles, user]) =>{
          user.setRoles(roles)
  }).catch(err => {
      logger.error(`Error adding rs to u`+ err)
     })

  }

  private async saveRoles(roles: any[]) {
    let savedRoles: any[] = [];
    for (let i = 0; i < roles.length; i++) {
      var role = await this.roleRepository.getRoleByName(roles[i]);
      if (role == null) {
        role = await this.roleRepository.save({ name: roles[i] });


      }
      savedRoles.push(role);
    }
    return savedRoles;
  }

  save(t: any): Promise<any> {
    return this.userRepository.save(t).then(user => {
     return user;
    })
    .catch((err: Error) => {throw err});
  }

  public async createUser(data: UserCreateDTO): Promise<void> {
    console.log(this.userRepository)
    console.log(data)
  }

  
  public async updatePassword(data: UserUpdatePasswordDTO) {
    console.log(data)
  }

  public async updateEmail(data: UserUpdateEmailDTO) {
    console.log(data)
  }

  public async isValidPassword(userGivenPassword: string, storedPassword: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(userGivenPassword, storedPassword, function (err, isMatch: boolean) {
        if (err) {
          return reject(err);
        }
        resolve(isMatch);
      });
    });
  }

  public normalizeEmail(email: string): string {
    return email.toLowerCase();
  }

  public normalizeUsername(username: string): string {
    return username.toLowerCase().replace(/ /g, '_').replace(/[^A-Za-z0-9_]/g, '');
  }

  public isValidUsername(username: string): boolean {
    const usernameNormalized = this.normalizeUsername(username);
    const length = usernameNormalized.length;
    return length >= 4 && length <= 30;
  }

  public async isUsernameAvailable(username: string): Promise<boolean> {
    console.log(username)
    return true
  }

  public async isEmailAvailable(givenEmail: string): Promise<boolean> {
    console.log(givenEmail)
    return true
  }

  public async hashPassword(password: string): Promise<string> {
    const normalizePassword = password.trim();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(normalizePassword, salt);
    return hash;
  }

}
