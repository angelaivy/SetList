import request from 'supertest'
import * as testUtils from '../testUtils';
import server from '../server';
import models from '../models';

describe('/artist', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const user = {
    email: 'angelaartist@mail.com',
    password: '123password',
  };

  const artist = {
    "name": "System of a Down",
    "genre": "Nu metal",
    "notes": "One of my favorite all time bands"
  }

  let token;

  beforeEach(async () => {
    await request(server).post('/auth/signup').send(user);
    const resLogin = await request(server).post('/auth/login').send(user);
    token = resLogin.body.token;
  });

  describe('POST /artist', () => {
    it('should return 200 and create a new artist', async () => {
      const res = await request(server).post('/artist')
        .set('Authorization', `Bearer ${token}`)
        .send(artist);
      expect(res.statusCode).toEqual(200);
      const findArtist = await models.Artist.findOne({name: artist.name});
      expect(findArtist).toMatchObject({ name: 'System of a Down' });
    });

    it('should return 500 if artist name is not provided', async () => {
      const res = await request(server).post('/artist')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('GET /artist', () => {
    it('should return 200 and get all artists of the user', async () => {
      const res = await request(server).get('/artist')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('PUT /artist/:id', () => {
    let originalArtist;
     beforeEach(async () => {
      const createArtistRes = await request(server).post('/artist')
        .set('Authorization', `Bearer ${token}`)
        .send(artist);
      originalArtist = createArtistRes.body;
     });

    it('should return 200 and update artist by id', async () => {
      const res = await request(server).put(`/artist/${originalArtist._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ notes: 'Updated note test' });
      expect(res.statusCode).toEqual(200);
      const updatedArtist = await models.Artist.findById(originalArtist._id).lean();
      expect(updatedArtist).toMatchObject({ notes: 'Updated note test' })
    });

    it('should return 404 if id is not provided', async () => {
      const res = await request(server).put(`/artist`)
        .set('Authorization', `Bearer ${token}`)
        .send({ notes: 'Updated note test' });
      expect(res.statusCode).toEqual(404);
    });

    it('should return 500 if no body', async () => {
      const res = await request(server).put(`/artist/${originalArtist._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('DELETE /artist/:id', () => {
    let originalArtist;
     beforeEach(async () => {
      const createArtistRes = await request(server).post('/artist')
        .set('Authorization', `Bearer ${token}`)
        .send(artist);
      originalArtist = createArtistRes.body;
     });

    it('should return 200 and artist should be deleted', async () => {
      const res = await request(server).delete(`/artist/${originalArtist._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      const findArtist = await models.Artist.findById(originalArtist._id);
      expect(findArtist).toBeNull();
    });
  });
});