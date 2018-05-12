export default class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const userToRemove = Object.assign({}, this.getUser({ id }));

    if (userToRemove) {
      this.users = this.users.filter(user => user.id !== userToRemove.id);
    }

    return userToRemove;
  }

  getUser({ id, name }) {
    return this.users.find(user => user.id === id || user.name === name);
  }

  getUserList(room) {
    const users = this.users.filter(user => user.room === room);
    const namesArray = users.map(user => user.name);

    return namesArray;
  }

  getRoomList() {
    const rooms = new Set(this.users.map(user => user.room));
    return [...rooms];
  }
}
