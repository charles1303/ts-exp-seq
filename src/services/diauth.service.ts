
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import * as moment from "moment";
import { Strategy, ExtractJwt } from "passport-jwt";
import * as bcrypt from "bcrypt-nodejs";
import logger from "../utils/logger";
import { inject, injectable } from "inversify";
import { BadRequestError, ForbiddenError, InvalidCredentialError, InvalidTokenError, NotFoundError, UnauthorizedError } from "../errors/app.errors";
import { TYPES } from "../configs/types";
import { IUserService } from "./user.service";
export const WRONG_EMAIL = "WRONG_EMAIL";

const User = require('../models').User;
const Role = require('../models').Role;

export interface IAuthService {
    registerUser(req: any, scope: any): Promise<any> ;
    login (req: any): Promise<any>;
    authenticate (callback: any): any;
    initialize(): any;
    checkIsUserInRole (allowedRoles: string[], token: string);
    registerUserWithRoles(req: any, scope: any): Promise<any> ;

}

@injectable()
export default class DiAuthService implements IAuthService{

    @inject(TYPES.UserService) private userService: IUserService;

    public constructor() {
        passport.use("jwt", this.getStrategy());
        passport.initialize();
    }
        

    public initialize(): any {
        passport.use("jwt", this.getStrategy());
        return passport.initialize();
    }

    public checkIsUserInRole (allowedRoles: string[], token: string) {
        if(!token) {
            throw new InvalidTokenError("Invalid token");
        }
        let decoded: any = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

        let intersection = decoded.roles.filter((role: string) => allowedRoles.includes(role));
         if (intersection.length === 0) {
          throw new ForbiddenError("Unauthorized user");
         }
     }

    public authenticate (callback: any): any {
        return passport.authenticate("jwt", { session: false, failWithError: true }, callback);
    }

    private genToken(user: any): any {
        let expires = moment().utc().add({ hours: 1 }).unix();
        var roles: string[] = user.get({ plain: true }).roles.map(role => role.name);
        let token = jwt.sign({ username: user.username, roles: roles }, process.env.JWT_SECRET, { expiresIn: expires });

        return {
            token: "JWT " + token,
            expires: moment.unix(expires).format(),
            user: user.id
        };
    }

    public async registerUser(req: any, scope: any): Promise<any> {

        try {
            const hashedPassword = bcrypt.hashSync(req.password, bcrypt.genSaltSync(10));;
       
            const userAddModel: any = {
                username: req.username,
                password: hashedPassword
            };
    
            await this.userService.save(userAddModel);
            
            const token = jwt.sign({ username: req.username, scope : scope }, process.env.JWT_SECRET);
            return { status: "success", data: token};
        } catch (error) {
            logger.error(error);
            throw new BadRequestError("Error registering user");
        }
        
      }

      public async registerUserWithRoles(req: any, scope: any): Promise<any> {

        try {
            const hashedPassword = bcrypt.hashSync(req.password, bcrypt.genSaltSync(10));;
       
            const userAddModel: any = {
                username: req.username,
                password: hashedPassword,
                roles: req.roles
            };
    
            await this.userService.saveUserWithRoles(userAddModel,userAddModel.roles);
            
            const token = jwt.sign({ username: req.username, scope : scope }, process.env.JWT_SECRET);
            return { status: "success", data: token};
        } catch (error) {
            logger.error(error);
            throw new BadRequestError("Error registering user");
        }
        
      }

    public async login (req: any): Promise<any> {
        try {

            let user = await User.findOne({
                where: {
                    username: req.username
                },
                include: [
                    {
                    model: Role,
                    as: "roles",
                    attributes: ["name"],
                    through: {
                        attributes: [],
                    }
                    },
                ],
            })
            if (user === null) throw new NotFoundError("User not found");
            let success = bcrypt.compareSync(req.password, user.getDataValue('password'));
            if (success !== true) throw new InvalidCredentialError("Invalid Credentials Error");

            return {"status": "success", "data": this.genToken(user).token};
        } catch (err) {
            logger.error(err);
            throw new UnauthorizedError("Error authenticating user");
        }
    }

    private getStrategy(): Strategy {
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
            passReqToCallback: true
        };

        return new Strategy(params, async (_req: any, _payload: any, done) => {
            try {
                return done(undefined, true);
              } catch (err) {
                logger.error("invalid User Found.......")
                console.error(err);
              }
        });
    }

}