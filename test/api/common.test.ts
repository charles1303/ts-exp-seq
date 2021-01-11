import * as request from 'supertest';
import app from '../../src/app';
const User = require('../../src/models').User;

const Role = require('../../src/models').Role;

const registerEndpointRoles = "/register-roles";
const loginEndpoint = "/login";


export const createDiffUserWithRoleEndpoint = async (user: any): Promise<any> => {
    return request(app).post(registerEndpointRoles)
        .send({ "username": user.username, "password": user.password, "roles": user.roles })
        .expect(201);
        
    };
const getUserByUsername = async (user: any): Promise<any> => {
    let userDb = await User.findOne({
        where: {
            username: user.username
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
    if (!userDb) {
        await createDiffUserWithRoleEndpoint(user);
        return getUserByUsername(user);
    } else {
        return userDb;
    }
};


export const loginByUsername = async (user: any): Promise<any> => {
    await getUserByUsername(user);
    return request(app).post(loginEndpoint)
        .send(user)
        .expect(200);
};

export const invalidlogin = async (user: any): Promise<any> => {
    return request(app).post(loginEndpoint)
        .send(user)
        .expect(401);
};

test("testing", () => {
    expect(1).toBe(1)
})