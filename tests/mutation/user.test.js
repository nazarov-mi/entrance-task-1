
describe('User mutation', function () {
  let tempId = undefined;

  it('Create user', async done => {
    const input = {
      login: 'Max',
      homeFloor: 5,
      avatarUrl: '@avatarUrl'
    };

    const r = await testgq(
      `
        mutation ($input: UserInput!) {
          createUser(input: $input) {
            id
            login
            homeFloor
            avatarUrl
          }
        }
      `,
      {
        input
      }
    );

    expect(r.status).toBe(200);
    expect(r.success).toBe(true);
    expect(r.data).toHaveProperty('createUser');
    expect(r.data.createUser).toHaveProperty('id');
    expect(r.data.createUser).toMatchObject(input);

    tempId = r.data.createUser.id;

    done();
  });

  it('Update user', async done => {
    const input = {
      login: 'Updated username',
      homeFloor: 7,
      avatarUrl: '@updated_avatarUrl'
    };

    const r = await testgq(
      `
        mutation ($id: ID!, $input: UserInput!) {
          updateUser(id: $id, input: $input) {
            id
            login
            homeFloor
            avatarUrl
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
    expect(r.data).toHaveProperty('updateUser');
    expect(r.data.updateUser).toHaveProperty('id', tempId);
    expect(r.data.updateUser).toMatchObject(input);

    done();
  });

  it('Remove user', async done => {
    const r = await testgq(
      `
        mutation ($id: ID!) {
          removeUser(id: $id) {
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
    expect(r.data).toHaveProperty('removeUser');
    expect(r.data.removeUser).toHaveProperty('id', tempId);

    done();
  });
});
