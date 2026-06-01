import request from 'supertest';
import jwt from 'jsonwebtoken';
import * as testUtils from '../testUtils';
import server from '../server';
import models from '../models';

describe('/auth', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const user = {
    email: 'angela@mail.com',
    password: '123password',
  };

  describe('signup', () => {
    it('should return 200 and with a password', async () => {
      const res = await request(server).post('/auth/signup').send(user);
      expect(res.statusCode).toEqual(200);
    });

    it('should return 400 if no password', async () => {
      const res = await request(server).post('/auth/signup').send({
        email: user.email,
      });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 if no password', async () => {
      const res = await request(server).post('/auth/signup').send({
        email: user.email,
      });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 409 for duplicate signups', async () => {
      await request(server).post('/auth/signup').send(user);
      const res = await request(server).post('/auth/signup').send(user);
      expect(res.statusCode).toEqual(409);
    });

    it('should return 500 if email is not provided', async () => {
      const res = await request(server).post('/auth/signup').send({
        password: user.password,
      });
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await request(server).post('/auth/signup').send(user);
    });

    it('should return 200 and a token when password matches', async () => {
      const res = await request(server).post('/auth/login').send(user);
      expect(res.statusCode).toEqual(200);
      expect(typeof res.body.token).toEqual('string');
    });

    it('should return a JWT with user email, _id, and roles inside, but not password', async () => {
      const res = await request(server).post('/auth/login').send(user);
      const { token } = res.body;
      const decodedToken = jwt.decode(token);
      expect(decodedToken.email).toEqual(user.email);
      expect(decodedToken.roles).toEqual(['user']);
      expect(decodedToken._id).toMatch(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
      expect(decodedToken.password).toBeUndefined();
    });

    it("should return 401 if passwords don't match", async () => {
      const res = await request(server).post('/auth/login').send({
        email: user.email,
        password: 'notthispassword',
      });
      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 if user isn't found", async () => {
      const res = await request(server).post('/auth/login').send({
        email: 'notthisemail@email.com',
        password: user.password,
      });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 if no email is provided', async () => {
      const res = await request(server).post('/auth/login').send({
        password: user.password,
      });
      expect(res.statusCode).toEqual(401);
    });

    it("should return 400 if passwords isn't provided", async () => {
      const res = await request(server).post('/auth/login').send({
        email: user.email,
      });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('delete', () => {
    let token;
    beforeEach(async () => {
      await request(server).post('/auth/signup').send(user);
      const resLogin = await request(server).post('/auth/login').send(user);
      token = resLogin.body.token;
    });

    it('should return 200', async () => {
      const res = await request(server)
        .delete('/auth/delete')
        .set('Authorization', `Bearer ${token}`)
        .send(user);
      expect(res.statusCode).toEqual(200);
      const findUser = await models.User.findOne({ email: user.email });
      expect(findUser).toBeNull();
    });

    it('should return 401 when no email is provided', async () => {
      const res = await request(server)
        .delete('/auth/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toEqual(401);
    });
  });
});
