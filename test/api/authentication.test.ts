
import * as request from 'supertest';
import app from '../../src/app';
import { loginByUsername } from './common.test';

const database = require('../../src/models');

const loginEndpoint = "/login";
const uploadsEndpoint = "/uploads";
const registerEndpointRoles = "/register-roles";

const registerTestUser = { "username": "username2222", "password": "password222", "roles": ["ADMIN1"] };
const filePath: string = "README.md";



describe("# Auth", () => {

    beforeAll(async () => {
        await database.sequelize.sync({ force: true })
      })

    test("should successfully register a user with roles", () => {

        return request(app).post(registerEndpointRoles)
            .send({ "username": registerTestUser.username, "password": registerTestUser.password, "roles": ["ADMIN", "GUEST"] })
            .expect(201);
    });

    test("should retrieve the token", () => {
            return loginByUsername({ "username": registerTestUser.username, "password": registerTestUser.password, "roles": ["ADMIN", "GUEST"] }).then(res => {
                expect(res.body.data).toBeTruthy();
                expect(res.status).toBe(200);
            });
    });

    test("should not login with the right username and wrong password", () => {
        return request(app).post(loginEndpoint)
            .send({ "username": registerTestUser.username, "password": "anythingGoesHere" })
            .expect(401);
    });

    test("should return invalid credentials error", () => {
        return request(app).post(loginEndpoint)
            .send({ "username": "testuser", "password": "" })
            .expect(401)
            .then(_res => {
                return request(app).post(loginEndpoint)
                    .send({ "username": "anotherusername", "password": "mypass" })
                    .expect(401);
            });
    });

    test("should return invalid signature message", () => {
        return request(app).post(uploadsEndpoint)
            .set("Authorization", "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0OTg5Mzk1MTksInVzZXJuYW1lIjoidGVzdHVzZXIifQ.FUJcVCzZTkjDr62MCJj5gvCFvmxewmz2jotiknuVbOg")
            .attach('upload', filePath)
            .then((res) => {
                expect(res.body.data).toBe("invalid signature");
                expect(res.status).toBe(401);
            });
    });

    afterAll(async () => {
        await database.sequelize.close()
      })
});
