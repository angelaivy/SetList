import request from 'supertest';
import * as testUtils from '../testUtils';
import server from '../server';

describe('/events', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  beforeAll(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const { TICKETMASTER_API_KEY } = process.env;
  const size = 75;
  const tmApiEndpoint = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=${size}&apikey=${TICKETMASTER_API_KEY}`;

  it('returns 200 & api results with response ok', async () => {
    const mockData = {
      artist: 'System of a down',
      venue: 'White River Ampitheatre',
    };

    fetch.mockResolvedValue({
      status: 200,
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const res = await request(server).get('/events');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(tmApiEndpoint);
  });

  it('returns 400 and response status if not ok', async () => {
    fetch.mockResolvedValue({
      status: 400,
      ok: false,
    });

    const res = await request(server).get('/events');
    expect(res.status).toEqual(400);
    expect(fetch).toHaveBeenCalledWith(tmApiEndpoint);
  });

  it('returns 401 if not ', async () => {
    fetch.mockResolvedValue({
      status: 401,
      ok: false,
    });

    const res = await request(server).get('/events');
    expect(res.status).toEqual(401);
    expect(fetch).toHaveBeenCalledWith(tmApiEndpoint);
  });

  it('returns 500 on api call error', async () => {
    fetch.mockRejectedValue(new Error('some error message'));
    const res = await request(server).get('/events');
    expect(res.status).toEqual(500);
  });
});
