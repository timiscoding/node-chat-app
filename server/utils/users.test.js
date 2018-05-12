import expect from 'expect';
import Users from './users';

describe('users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: 1,
      name: 'Mike',
      room: 'Node course',
    }, {
      id: 2,
      name: 'Jen',
      room: 'React course',
    }, {
      id: 3,
      name: 'Julie',
      room: 'Node course',
    }];
  });

  it('should add new user', () => {
    const user = { id: 123, name: 'Tim', room: 'The Office Fans' };
    users.addUser(user.id, user.name, user.room);

    expect(users.users).toInclude(user);
  });

  it('should return names for node course', () => {
    const userList = users.getUserList('Node course');
    expect(userList).toEqual(['Mike', 'Julie']);
  });

  it('should return names for react course', () => {
    const userList = users.getUserList('React course');
    expect(userList).toEqual(['Jen']);
  });

  it('should remove a user', () => {
    const user = users.users[0];
    const removedUser = users.removeUser(user.id);
    expect(removedUser).toEqual(user);
    expect(users.users).toNotInclude(user);
  });

  it('should not remove user', () => {
    const userId = 4124;
    const removedUser = users.removeUser(userId);
    expect(removedUser).toNotBe(undefined);
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const user = users.users[0];
    let foundUser = users.getUser({ id: user.id });
    expect(foundUser).toEqual(user);

    foundUser = users.getUser({ name: user.name });
    expect(foundUser).toEqual(user);
  });

  it('should not find user', () => {
    const user = { id: 4124, name: '4124name' };
    let foundUser = users.getUser(user.id);
    expect(foundUser).toBe(undefined);

    foundUser = users.getUser(user.name);
    expect(foundUser).toBe(undefined);
  });

  it('should return room names', () => {
    const rooms = users.getRoomList();
    expect(rooms).toEqual(['Node course', 'React course']);
  });
});
