
const { models, sequelize } = require('../../models');

describe('User query', function () {
  const input = {
    login: 'Max',
    homeFloor: 5,
    avatarUrl: '@avatarUrl'
  };
  let tempId = undefined;

  beforeAll(async done => {
    await sequelize.sync();
    const user = await models.User.create(input);
    
    tempId = String(user.id);
    input.id = tempId;

    done();
  });

  afterAll(async done => {
    await sequelize.sync();
    const user = await models.User.findById(tempId);
    await user.destroy();

    done();
  });

  it('Get user', async done => {
    const r = await testgq(
      `
        query ($id: ID!) {
          user(id: $id) {
            id
            login
            homeFloor
            avatarUrl
          }
        }
      `,
      {
        id: tempId
      }
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('user');
    expect(r.data.user).toMatchObject(input);

    done();
  });

  it('Get users', async done => {
    const r = await testgq(
      `
        {
          users {
            id
            login
            homeFloor
            avatarUrl
          }
        }
      `
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('users');
    expect(r.data.users).toContainEqual(input);

    done();
  });
});
