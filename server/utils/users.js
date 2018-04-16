class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = Object.assign({}, this.getUser({id}));

    if (user) {
      this.users = this.users.filter(user => user.id !== id);
    }

    return user;
  }

  getUser({id, name}) {
    return this.users.find(user => user.id === id || user.name === name);
  }

  getUserList(room) {
    var users = this.users.filter(user => user.room === room);
    var namesArray = users.map(user => user.name);

    return namesArray;
  }

  getRoomList() {
    var rooms = new Set(this.users.map(user => user.room));
    return [...rooms];
  }
}

module.exports = {Users};
