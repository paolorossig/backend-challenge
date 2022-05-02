import 'dotenv/config';
import supertest from 'supertest';
import app from '../app.js';
import Character from '../models/chraracter.model.js';
import { connectDb, disconnectDb, cleanupDb } from '../utils/db.js';

const mockData = {
  characterWithoutId: {
    name: 'Super Hero',
    comicsAvailable: 10,
    seriesAvailable: 10,
    storiesAvailable: 10,
  },
  characterWithId: {
    id: 1,
    name: 'Super Hero',
    comicsAvailable: 10,
    seriesAvailable: 10,
    storiesAvailable: 10,
  },
  listOfCharacters: [
    {
      id: 1,
      name: 'Super Hero',
      comicsAvailable: 10,
      seriesAvailable: 10,
      storiesAvailable: 10,
    },
    {
      id: 2,
      name: 'Super Hero 2',
      comicsAvailable: 20,
      seriesAvailable: 20,
      storiesAvailable: 20,
    },
  ],
};

describe('chracters', () => {
  beforeAll(connectDb);
  beforeEach(async () => {
    await cleanupDb();
  });
  afterAll(async () => {
    await disconnectDb();
  });

  it('should not create a character when there is no id', async () => {
    const data = { characters: [mockData.characterWithoutId] };

    const res = await supertest(app).post('/characters').send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      'Character validation failed: id: Path `id` is required.'
    );
  });

  it('should not create character when id already exist', async () => {
    const data = { characters: [mockData.characterWithId] };
    await Character.create(data.characters[0]);

    const res = await supertest(app).post('/characters').send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/E11000 duplicate key error collection/i);
  });

  it('should create a list of characters correctly', async () => {
    const data = { characters: mockData.listOfCharacters };

    const res = await supertest(app).post('/characters').send(data);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('2 characters uploaded successfully');
  });

  it('should return an empty array of characters if limit is not set', async () => {
    const data = { characters: mockData.listOfCharacters };
    await Character.insertMany(data.characters);

    const res = await supertest(app).get('/characters');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.characters).toHaveLength(0);
  });

  it('should get a list of characters correctly', async () => {
    const data = { characters: mockData.listOfCharacters };
    await Character.insertMany(data.characters);

    const res = await supertest(app).get('/characters?limit=20&offset=0');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.total).toBe(2);
    expect(res.body.data.characters).toHaveLength(2);
  });

  it('should delete all characters from the collection', async () => {
    const data = { characters: mockData.listOfCharacters };
    await Character.insertMany(data.characters);

    const res = await supertest(app).delete('/characters');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('All characters deleted successfully');
    const charactersAfter = await Character.find({});
    expect(charactersAfter).toHaveLength(0);
  });
});
