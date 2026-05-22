import request from 'supertest';
import * as testUtils from '../testUtils';
import server from '../server';
import models from '../models';

describe('/show', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const user = {
    email: 'angelashow@mail.com',
    password: '123password',
  };

  const show = {
    "name": "Lettuce with the Oregon Symphony",
    "showDetails": {
        "artist": "Lettuce",
        "venue": "Portland Symphony Hall",
        "dateRaw": "May 2, 2026"
    },
    "notes": "Saw old friends, great show!",
    "rating": 5,
    "status": "Attended",
    "ticketmasterId": "123456789"
  }

  let token;

  beforeEach(async () => {
    await request(server).post('/auth/signup').send(user);
    const resLogin = await request(server).post('/auth/login').send(user);
    token = resLogin.body.token;
  });

  describe('POST /show', () => {
    it('should return 200 and create a new show', async () => {
      const res = await request(server)
        .post('/show')
        .set('Authorization', `Bearer ${token}`)
        .send(show);
      expect(res.statusCode).toEqual(200);
      const findShow = await models.Show.findOne({ name: show.name });
      expect(findShow).toMatchObject({ name: 'Lettuce with the Oregon Symphony' });
    });

    it('should return 409 when trying to create an existing show with a ticketmasterId', async () => {
      const res0 = await request(server)
        .post('/show')
        .set('Authorization', `Bearer ${token}`)
        .send(show);
      expect(res0.statusCode).toEqual(200);
      const res1 = await request(server)
        .post('/show')
        .set('Authorization', `Bearer ${token}`)
        .send(show);
      expect(res1.statusCode).toEqual(409);
    });
  
    it('should return 500 if show name is not provided', async () => {
      const res = await request(server)
        .post('/show')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('GET /show', () => {
    it('should return 200 and get all shows of the user', async () => {
      const res = await request(server)
        .get('/show')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('PUT /show/:id', () => {
    let originalShow;
    beforeEach(async () => {
      const createShowRes = await request(server)
        .post('/show')
        .set('Authorization', `Bearer ${token}`)
        .send(show);
      originalShow = createShowRes.body;
    });

    it('should return 200 and update show by id', async () => {
      const res = await request(server)
        .put(`/show/${originalShow._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ notes: 'Updated note test' });
      expect(res.statusCode).toEqual(200);
      const updatedShow = await models.Show.findById(
        originalShow._id,
      ).lean();
      expect(updatedShow).toMatchObject({ notes: 'Updated note test' });
    });

    it('should return 404 if id is not provided', async () => {
      const res = await request(server)
        .put(`/show`)
        .set('Authorization', `Bearer ${token}`)
        .send({ notes: 'Updated note test' });
      expect(res.statusCode).toEqual(404);
    });

    it('should return 500 if no body', async () => {
      const res = await request(server)
        .put(`/show/${originalShow._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('DELETE /show/:id', () => {
    let originalShow;
    beforeEach(async () => {
      const createShowRes = await request(server)
        .post('/show')
        .set('Authorization', `Bearer ${token}`)
        .send(show);
      originalShow = createShowRes.body;
    });

    it('should return 200 and show should be deleted', async () => {
      const res = await request(server)
        .delete(`/show/${originalShow._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      const findShow = await models.Show.findById(originalShow._id);
      expect(findShow).toBeNull();
    });
  });

  describe('GET /show/search', () => {
    let originalShow;
    beforeEach(async () => {
      const createShowRes = await request(server)
        .post('/show')
        .set('Authorization', `Bearer ${token}`)
        .send(show);
      originalShow = createShowRes.body;
    });

    it('should return 200 and shows should be returned', async () => {
      const res = await request(server)
        .get(`/show/search?query=Lettuce`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      const findShow = await models.Show.findById(originalShow._id);
      expect(res.body[0]).toEqual(JSON.parse(JSON.stringify(findShow)));
    });

    it('should return 400 if no query is provided', async () => {
      const res = await request(server)
        .get(`/show/search`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(400);
    });
  });
});