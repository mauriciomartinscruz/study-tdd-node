const bcrypt = require('bcryptjs')

const {
  User
} = require('../../src/app/models')
const truncate = require('../utils/truncate')

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  })

  it('Should encrypt user password', async () => {
    const user = await User.create({
      name: 'Mauricio',
      email: 'mmm@gmail.com',
      password: '123457'
    });

    const hash = await bcrypt.hash('123457', 8);
    const compareHash = await bcrypt.compare('123457', user.password_hash);

    expect(compareHash).toBe(true);
  });

})