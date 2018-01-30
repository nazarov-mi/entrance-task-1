
describe('Event mutation', function () {
  const NOW = (new Date()).valueOf();
  const ONE_HOUR = 1000 * 60 * 60;
  let tempId = undefined;

  it('Create event', async done => {
    const dateStart = (new Date(NOW)).toISOString();
    const dateEnd = (new Date(NOW + ONE_HOUR)).toISOString();
    const input = {
      dateStart,
      dateEnd,
      title: 'Event name'
    };
    const usersIds = ['1', '2', '3'];
    const roomId = '1';

    const r = await testgq(
      `
        mutation ($input: EventInput!, $usersIds: [ID]!, $roomId: ID!) {
          createEvent(input: $input, usersIds: $usersIds, roomId: $roomId) {
            id
            title
            dateStart
            dateEnd
            users {
              id
            }
            room {
              id
            }
          }
        }
      `,
      {
        input,
        usersIds,
        roomId
      }
    );

    const expectedInput = Object.assign({}, input, {
      users: usersIds.map(id => ({ id })),
      room: {
        id: roomId
      }
    });

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('createEvent');
    expect(r.data.createEvent).toHaveProperty('id');
    expect(r.data.createEvent).toMatchObject(expectedInput);

    tempId = r.data.createEvent.id;

    done();
  });

  it('Update event', async done => {
    const dateStart = (new Date(NOW + ONE_HOUR)).toISOString();
    const dateEnd = (new Date(NOW + ONE_HOUR * 2)).toISOString();
    const input = {
      dateStart,
      dateEnd,
      title: 'Updated event name'
    };
    const usersIds = ['1', '3'];
    const roomId = '2';

    const r = await testgq(
      `
        mutation ($id: ID!, $input: EventInput!, $usersIds: [ID], $roomId: ID) {
          updateEvent(id: $id, input: $input, usersIds: $usersIds, roomId: $roomId) {
            id
            title
            dateStart
            dateEnd
            users {
              id
            }
            room {
              id
            }
          }
        }
      `,
      {
        input,
        usersIds,
        roomId,
        id: tempId
      }
    );

    const expectedInput = Object.assign({}, input, {
      users: usersIds.map(id => ({ id })),
      room: {
        id: roomId
      }
    });

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('updateEvent');
    expect(r.data.updateEvent).toHaveProperty('id', tempId);
    expect(r.data.updateEvent).toMatchObject(expectedInput);

    done();
  });

  it('Remove user from event', async done => {
    const userId = '1';

    const r = await testgq(
      `
        mutation ($id: ID!, $userId: ID!) {
          removeUserFromEvent(id: $id, userId: $userId) {
            users {
              id
            }
          }
        }
      `,
      {
        userId,
        id: tempId
      }
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('removeUserFromEvent');
    expect(r.data.removeUserFromEvent.users).not.toContainEqual({
      id: userId
    });

    done();
  });

  it('Add user to event', async done => {
    const userId = '1';

    const r = await testgq(
      `
        mutation ($id: ID!, $userId: ID!) {
          addUserToEvent(id: $id, userId: $userId) {
            users {
              id
            }
          }
        }
      `,
      {
        userId,
        id: tempId
      }
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('addUserToEvent');
    expect(r.data.addUserToEvent.users).toContainEqual({
      id: userId
    });

    done();
  });

  it('Change event room', async done => {
    const roomId = '2';

    const r = await testgq(
      `
        mutation ($id: ID!, $roomId: ID!) {
          changeEventRoom(id: $id, roomId: $roomId) {
            room {
              id
            }
          }
        }
      `,
      {
        roomId,
        id: tempId
      }
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('changeEventRoom');
    expect(r.data.changeEventRoom.room).toMatchObject({
      id: roomId
    });

    done();
  });

  it('Remove event', async done => {
    const r = await testgq(
      `
        mutation ($id: ID!) {
          removeEvent(id: $id) {
            id
          }
        }
      `,
      {
        id: tempId
      }
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('removeEvent');
    expect(r.data.removeEvent).toHaveProperty('id', tempId);

    done();
  });
});
