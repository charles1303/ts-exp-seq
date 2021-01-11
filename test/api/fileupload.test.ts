
import * as request from 'supertest';
import app from '../../src/app';
import * as fs from 'fs';
import { invalidlogin, loginByUsername } from './common.test';

const database = require('../../src/models');
const uploadsEndpoint = "/uploads";

const path = require("path");
const filePath: string = path.join(__dirname, "../uploads/fileuploadtest")

describe('Uploads', () => {

  beforeAll(async () => {
    await database.sequelize.sync({ force: true })
  })

  test('should upload the test file', () => {
      
      
    if(!fs.existsSync(filePath)) {
    
      throw new Error('file does not exist');   
    }
            
        return request(app)
          .post('/uploads')       
          .attach('upload', filePath)
          .then((res) => {
            const { status, data } = res.body;
            expect(status).toBeTruthy();
            expect(data).toBe('No auth token');
          })
  })

    test("should not upload file successfully with wrong credentials", () => {

      return invalidlogin({ "username": "username222255", "password": "password22255", "roles": ["ADMIN"] })
          .then(_res => {
              return request(app)
              .post(uploadsEndpoint) 
              .attach('upload', filePath)
              .expect(401);
          });
    });

    test("should not upload file successfully without ADMIN roles", () => {

      return loginByUsername({ "username": "username22226", "password": "password2226", "roles": ["GUEST"] })
          .then(res => {
              return request(app)
              .post(uploadsEndpoint) 
              .set("Authorization", res.body.data)
              .attach('upload', filePath)
              .expect(403);
          });
    });

    test("should upload file successfully with ADMIN roles", () => {
      return loginByUsername({ "username": "username22221", "password": "password2221", "roles": ["ADMIN"] })
          .then(res => {
              return request(app)
              .post(uploadsEndpoint)
              .set("Authorization", res.body.data)
              .attach('upload', filePath)
              .expect(201);
              });
  });

  afterAll(async () => {
    await database.sequelize.close()
  })
  
});
