
const { models, sequelize } = require('../../models');

describe('Event query', function () {
  const NOW = (new Date()).valueOf();
  const ONE_HOUR = 1000 * 60 * 60;
  const dateStart = (new Date(NOW)).toISOString();
  const dateEnd = (new Date(NOW + ONE_HOUR)).toISOString();
  const input = {
    title: 'Event name',
    dateStart,
    dateEnd
  };
  let tempId = undefined;

  beforeAll(async done => {
    await sequelize.sync();
    const event = await models.Event.create(input);
    
    tempId = String(event.id);
    input.id = tempId;

    done();
  });

  afterAll(async done => {
    await sequelize.sync();
    const event = await models.Event.findById(tempId);
    await event.destroy();

    done();
  });

  it('Get event', async done => {
    const r = await testgq(
      `
        query ($id: ID!) {
          event(id: $id) {
            id
            title
            dateStart
            dateEnd
          }
        }
      `,
      {
        id: tempId
      }
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('event');
    expect(r.data.event).toMatchObject(input);

    done();
  });

  it('Get events', async done => {
    const r = await testgq(
      `
        {
          events {
            id
            title
            dateStart
            dateEnd
          }
        }
      `
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('events');
    expect(r.data.events).toContainEqual(input);

    done();
  });
});
