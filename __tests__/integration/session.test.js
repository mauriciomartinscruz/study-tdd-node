const request = require('supertest')

const app = require('../../src/app')
const truncate = require('../utils/truncate');
const factory = require('../factories')

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  })
  it("Should sum two number", async () => {
    const user = await factory.create('User', {
      password: '123457'
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123457'
      })

    expect(response.status).toBe(200);
  });

  it('Should not authentication with invalid credentials', async () => {
    const user = await factory.create('User', {
      password: '1234573a'
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123459'
      })

    expect(response.status).toBe(401);
  })

  it('Should return jwt token when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123457'
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123457'
      })

    expect(response.body).toHaveProperty("token");
  })

  it('Should be able to access private routes when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123457'
    });

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  })

  it('Should not be able to access private routes without jwt token', async () => {
    const response = await request(app)
      .get('/dashboard');

    expect(response.status).toBe(401);
  })

  it('Should not be able to access private routes with invalid jwt token', async () => {
    const user = await factory.create('User', {
      password: '123457'
    });

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(401);    
  })

})