
const { models, sequelize } = require('../../models');

describe('Room query', function () {
  const input = {
    title: 'Room name',
    capacity: 10,
    floor: 4
  };
  let tempId = undefined;

  beforeAll(async done => {
    await sequelize.sync();
    const room = await models.Room.create(input);
    
    tempId = String(room.id);
    input.id = tempId;

    done();
  });

  afterAll(async done => {
    await sequelize.sync();
    const room = await models.Room.findById(tempId);
    await room.destroy();

    done();
  });

  it('Get room', async done => {
    const r = await testgq(
      `
        query ($id: ID!) {
          room(id: $id) {
            id
            title
            capacity
            floor
          }
        }
      `,
      {
        id: tempId
      }
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('room');
    expect(r.data.room).toMatchObject(input);

    done();
  });

  it('Get rooms', async done => {
    const r = await testgq(
      `
        {
          rooms {
            id
            title
            capacity
            floor
          }
        }
      `
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('rooms');
    expect(r.data.rooms).toContainEqual(input);

    done();
  });
});
