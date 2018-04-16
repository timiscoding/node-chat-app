var expect = require('expect');
var {Users} = require('./users');


describe('users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: 1,
      name: 'Mike',
      room: 'Node course'
    }, {
      id: 2,
      name: 'Jen',
      room: 'React course'
    }, {
      id: 3,
      name: 'Julie',
      room: 'Node course'
    }];
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {id: 123, name: 'Tim', room: 'The Office Fans'};
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should return names for node course', () => {
    var userList = users.getUserList('Node course');
    expect(userList).toEqual(['Mike', 'Julie']);
  });

  it('should return names for react course', () => {
    var userList = users.getUserList('React course');
    expect(userList).toEqual(['Jen']);
  });

  it('should remove a user', () => {
    var user = users.users[0];
    var removedUser = users.removeUser(user.id);
    expect(removedUser).toEqual(user);
    expect(users.users).toNotInclude(user);
  });

  it('should not remove user', () => {
    var userId = 4124;
    var removedUser = users.removeUser(userId);
    expect(removedUser).toBeUndefined;
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var user = users.users[0];
    var foundUser = users.getUser({id: user.id});
    expect(foundUser).toEqual(user);

    var foundUser = users.getUser({name: user.name});
    expect(foundUser).toEqual(user);
  });

  it('should not find user', () => {
    var user = {id: 4124, name: '4124name'};
    var foundUser = users.getUser(user.id);
    expect(foundUser).toBeUndefined;

    var foundUser = users.getUser(user.name);
    expect(foundUser).toBeUndefined;
  });

  it('should return room names', () => {
    var rooms = users.getRoomList();
    expect(rooms).toEqual(['Node course', 'React course']);
  });
});
