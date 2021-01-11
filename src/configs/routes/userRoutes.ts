import { Router } from "express";
import UserController from '../../controllers/user.controller';
import container from '../inversify';
import asyncWrap from '../../utils/asyncWrapper';
import { AuthController } from "../../controllers/auth.controller";
import FileUploadController from "../../controllers/fileupload.controller";

export class UserRoutes {

    private userControllerInstance: UserController;
    private authControllerInstance: AuthController;
    private fileUploadControllerInstance: FileUploadController;
    private router: Router;
   
    constructor(router: Router) {
        this.router = router;
        this.userControllerInstance = container.get<UserController>(UserController);
        this.authControllerInstance = container.get<AuthController>(AuthController);
        this.fileUploadControllerInstance = container.get<FileUploadController>(FileUploadController);
        this.routes();
    }
    routes() {
        this.router.post('/users', asyncWrap(this.userControllerInstance.save.bind(this.userControllerInstance)));
        this.router.get('/users2:id', asyncWrap(this.userControllerInstance.get.bind(this.userControllerInstance)));
        this.router.post('/register', asyncWrap(this.authControllerInstance.registerUser.bind(this.authControllerInstance)));
        this.router.post('/register-roles', asyncWrap(this.authControllerInstance.registerUserWithRoles.bind(this.authControllerInstance)));
        this.router.post('/login', asyncWrap(this.authControllerInstance.login.bind(this.authControllerInstance)));
        this.router.post('/uploads', this.authControllerInstance.checkIsUserInRole(["ADMIN","CUST"]), asyncWrap(this.fileUploadControllerInstance.doUpload.bind(this.fileUploadControllerInstance)));
    }
}