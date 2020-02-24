const request = require('supertest')

const app = require('../../src/app')
const {
  User
} = require('../../src/app/models')
const truncate = require('../utils/truncate');

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  })
  it("Should sum two number", async () => {
    const user = await User.create({
      name: 'Mauricio',
      email: 'teste1@gmail.com',
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
    const user = await User.create({
      name: 'Mauricio',
      email: 'teste1@gmail.com',
      password: '123123a'
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
    const user = await User.create({
      name: 'Mauricio',
      email: 'teste1@gmail.com',
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

})