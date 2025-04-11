import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/multi-vendor-test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Auth API', () => {
  it('should signup a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test Vendor',
      email: 'vendor@test.com',
      password: 'test1234',
      role: 'vendor'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('should login the user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'vendor@test.com',
      password: 'test1234'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
