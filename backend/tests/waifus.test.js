const request = require('supertest');

jest.mock('../src/db', () => ({
  pool: { query: jest.fn() },
  initDB: jest.fn(),
}));

const app = require('../src/index');
const { pool } = require('../src/db');

beforeEach(() => pool.query.mockReset());

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('waifu-library-api');
  });
});

describe('GET /api/waifus', () => {
  it('returns list of waifus', async () => {
    pool.query.mockResolvedValue({
      rows: [
        { id: 1, name: 'Rem', anime: 'Re:Zero', rating: 9.8 },
        { id: 2, name: 'Zero Two', anime: 'DARLING in the FranXX', rating: 9.7 },
      ],
    });
    const res = await request(app).get('/api/waifus');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.total).toBe(2);
  });

  it('filters by anime query param', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 1, name: 'Rem', anime: 'Re:Zero', rating: 9.8 }],
    });
    const res = await request(app).get('/api/waifus?anime=Re:Zero');
    expect(res.status).toBe(200);
    expect(res.body.data[0].name).toBe('Rem');
  });
});

describe('GET /api/waifus/:id', () => {
  it('returns a single waifu', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 1, name: 'Rem', anime: 'Re:Zero', rating: 9.8 }],
    });
    const res = await request(app).get('/api/waifus/1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Rem');
  });

  it('returns 404 when waifu not found', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const res = await request(app).get('/api/waifus/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Waifu not found');
  });
});

describe('POST /api/waifus', () => {
  it('creates a new waifu', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 21, name: 'Test Waifu', anime: 'Test Anime', rating: 8.0 }],
    });
    const res = await request(app)
      .post('/api/waifus')
      .send({ name: 'Test Waifu', anime: 'Test Anime', rating: 8.0 });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Waifu');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/waifus').send({ anime: 'Test Anime' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name/i);
  });

  it('returns 400 when anime is missing', async () => {
    const res = await request(app).post('/api/waifus').send({ name: 'Test Waifu' });
    expect(res.status).toBe(400);
  });
});
