import { Container } from 'inversify';
import { TYPES } from './types';
import {IUserRepository, UserRepository } from '../repositories/user.repository';

import UserService, { IUserService } from '../services/user.service';
import UserController from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';

import { IUploadService } from '../services/i-upload.service';
import FileUploadService from '../services/fileupload.service';
import S3FileUploadService from '../services/s3fileupload.service';
import FileUploadController from '../controllers/fileupload.controller';
import DiAuthService, { IAuthService } from '../services/diauth.service';
import { IRoleRepository, RoleRepository } from '../repositories/role.repository';
import RoleService, { IRoleService } from '../services/role.service';

const container = new Container({ defaultScope: 'Singleton' });
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IRoleRepository>(TYPES.RoleRepository).to(RoleRepository);

container.bind<IRoleService>(TYPES.RoleService).to(RoleService);
container.bind<IUploadService>(TYPES.FileUploadService).to(FileUploadService);
container.bind<IUploadService>(TYPES.S3FileUploadService).to(S3FileUploadService);
container.bind<IAuthService>(TYPES.DiAuthService).to(DiAuthService);
container.bind<IUserService>(TYPES.UserService).to(UserService);

container.bind(UserController).to(UserController);
container.bind(AuthController).to(AuthController);
container.bind(FileUploadController).to(FileUploadController);


export default container;
