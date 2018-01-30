
describe('Room mutation', function () {
  let tempId = undefined;

  it('Create room', async done => {
    const input = {
      title: 'Room name',
      capacity: 3,
      floor: 5
    };

    const r = await testgq(
      `
        mutation ($input: RoomInput!) {
          createRoom(input: $input) {
            id
            title
            capacity
            floor
          }
        }
      `,
      {
        input
      }
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('createRoom');
    expect(r.data.createRoom).toHaveProperty('id');
    expect(r.data.createRoom).toMatchObject(input);

    tempId = r.data.createRoom.id;

    done();
  });

  it('Update room', async done => {
    const input = {
      title: 'Updated room name',
      capacity: 5,
      floor: 7
    };

    const r = await testgq(
      `
        mutation ($id: ID!, $input: RoomInput!) {
          updateRoom(id: $id, input: $input) {
            id
            title
            capacity
            floor
          }
        }
      `,
      {
        input,
        id: tempId
      }
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('updateRoom');
    expect(r.data.updateRoom).toHaveProperty('id', tempId);
    expect(r.data.updateRoom).toMatchObject(input);

    done();
  });

  it('Remove room', async done => {
    const r = await testgq(
      `
        mutation ($id: ID!) {
          removeRoom(id: $id) {
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
    expect(r.data).toHaveProperty('removeRoom');
    expect(r.data.removeRoom).toHaveProperty('id', tempId);

    done();
  });
});
