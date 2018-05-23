require('source-map-support').install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/controllers/user.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/user.controller.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/helpers */ "./server/utils/helpers.js");



const User = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('User');

const createOne = async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  const newUser = await user.save();
  res.send(`create user ${newUser}`);
};

const getOne = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.send(`get user\n ${user}`);
};

const updateOne = (req, res) => {
  res.send(`update user\n ${req.docFromId}`);
};

const deleteOne = (req, res) => {
  res.send(`delete user\n ${req.docFromId}`);
};

/* harmony default export */ __webpack_exports__["default"] = ({
  createOne: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__["catchAsyncError"])(createOne),
  getOne: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__["catchAsyncError"])(getOne),
  updateOne: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__["catchAsyncError"])(updateOne),
  deleteOne: Object(_utils_helpers__WEBPACK_IMPORTED_MODULE_1__["catchAsyncError"])(deleteOne),
});


/***/ }),

/***/ "./server/db.js":
/*!**********************!*\
  !*** ./server/db.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


const connect = () => mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connect('mongodb://127.0.0.1:27017/node-chat-app');

/* harmony default export */ __webpack_exports__["default"] = (connect);



/***/ }),

/***/ "./server/middleware.js":
/*!******************************!*\
  !*** ./server/middleware.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! passport */ "passport");
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(passport__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express_session__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express-session */ "express-session");
/* harmony import */ var express_session__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express_session__WEBPACK_IMPORTED_MODULE_4__);






/* harmony default export */ __webpack_exports__["default"] = ([
  express__WEBPACK_IMPORTED_MODULE_0___default.a.static(path__WEBPACK_IMPORTED_MODULE_1___default.a.join(__dirname, '../../public')),
  body_parser__WEBPACK_IMPORTED_MODULE_2___default.a.json(),
  body_parser__WEBPACK_IMPORTED_MODULE_2___default.a.urlencoded({ extended: true }),
  express_session__WEBPACK_IMPORTED_MODULE_4___default()({ secret: 'keyboard cat' }),
  passport__WEBPACK_IMPORTED_MODULE_3___default.a.initialize(),
  passport__WEBPACK_IMPORTED_MODULE_3___default.a.session(),
]);


/***/ }),

/***/ "./server/models/index.js":
/*!********************************!*\
  !*** ./server/models/index.js ***!
  \********************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user.model */ "./server/models/user.model.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "User", function() { return _user_model__WEBPACK_IMPORTED_MODULE_0__["default"]; });




/***/ }),

/***/ "./server/models/user.model.js":
/*!*************************************!*\
  !*** ./server/models/user.model.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ "bcrypt");
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var validator_lib_isEmail__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! validator/lib/isEmail */ "validator/lib/isEmail");
/* harmony import */ var validator_lib_isEmail__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(validator_lib_isEmail__WEBPACK_IMPORTED_MODULE_2__);




const userSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  email: {
    type: String,
    required: 'You must supply a email',
    unique: 'Email already exists',
    trim: true,
    lowercase: true,
    validate: [validator_lib_isEmail__WEBPACK_IMPORTED_MODULE_2___default.a, 'Email is not valid'],
  },
  password: {
    type: String,
    required: 'You must supply a password',
    trim: true,
    minlength: 5,
  },
});

userSchema.methods = {
  hashPassword(plaintextPassword) {
    if (!plaintextPassword) {
      throw new Error('Password cannot be blank');
    }
    return bcrypt__WEBPACK_IMPORTED_MODULE_1___default.a.hash(plaintextPassword, 12);
  },
  isValidPassword(password) {
    return bcrypt__WEBPACK_IMPORTED_MODULE_1___default.a.compare(password, this.password);
  },
};

userSchema.pre('save', async function preSaveUser(next) {
  this.password = await this.hashPassword(this.password);
  next();
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('User', userSchema));


/***/ }),

/***/ "./server/passport.js":
/*!****************************!*\
  !*** ./server/passport.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! passport */ "passport");
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(passport__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var passport_local__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! passport-local */ "passport-local");
/* harmony import */ var passport_local__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(passport_local__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);




const User = mongoose__WEBPACK_IMPORTED_MODULE_2___default.a.model('User');

passport__WEBPACK_IMPORTED_MODULE_0___default.a.use(new passport_local__WEBPACK_IMPORTED_MODULE_1___default.a({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false);
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport__WEBPACK_IMPORTED_MODULE_0___default.a.serializeUser((user, done) => done(null, user.id));
passport__WEBPACK_IMPORTED_MODULE_0___default.a.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});


/***/ }),

/***/ "./server/routes/index.js":
/*!********************************!*\
  !*** ./server/routes/index.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! passport */ "passport");
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(passport__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _user_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user.router */ "./server/routes/user.router.js");




const routes = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

routes.get('/login', (req, res) => {
  res.send('<p>login form</p>');
});
routes.post('/login', passport__WEBPACK_IMPORTED_MODULE_1___default.a.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
}));
routes.use('/user', _user_router__WEBPACK_IMPORTED_MODULE_2__["userRouter"]);

routes.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(500).send(`Something messed up... ${err.message}`);
});

/* harmony default export */ __webpack_exports__["default"] = (routes);


/***/ }),

/***/ "./server/routes/user.router.js":
/*!**************************************!*\
  !*** ./server/routes/user.router.js ***!
  \**************************************/
/*! exports provided: userRouter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userRouter", function() { return userRouter; });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var connect_ensure_login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! connect-ensure-login */ "connect-ensure-login");
/* harmony import */ var connect_ensure_login__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(connect_ensure_login__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../controllers/user.controller */ "./server/controllers/user.controller.js");





const userRouter = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();
const User = mongoose__WEBPACK_IMPORTED_MODULE_2___default.a.model('User');

userRouter.param('id', async (req, res, next, id) => {
  try {
    if (!mongoose__WEBPACK_IMPORTED_MODULE_2___default.a.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user id');
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error('No user found');
    } else {
      req.docFromId = user;
      next();
    }
  } catch (err) {
    next(err.message);
  }
});

userRouter.route('/')
  .post(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].createOne);

userRouter.route('/:id')
  .get(Object(connect_ensure_login__WEBPACK_IMPORTED_MODULE_1__["ensureLoggedIn"])(), _controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].getOne)
  .put(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].updateOne)
  .delete(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_3__["default"].deleteOne);


/***/ }),

/***/ "./server/server.js":
/*!**************************!*\
  !*** ./server/server.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! socket.io */ "socket.io");
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./db */ "./server/db.js");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models */ "./server/models/index.js");
/* harmony import */ var _passport__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./passport */ "./server/passport.js");
/* harmony import */ var _socketEvent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./socketEvent */ "./server/socketEvent.js");
/* harmony import */ var _middleware__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./middleware */ "./server/middleware.js");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./routes */ "./server/routes/index.js");
/* eslint-disable no-console */












const port = process.env.PORT || 3000;
const app = express__WEBPACK_IMPORTED_MODULE_0___default()();
const server = http__WEBPACK_IMPORTED_MODULE_1___default.a.createServer(app);
const io = socket_io__WEBPACK_IMPORTED_MODULE_2___default()(server);
Object(_db__WEBPACK_IMPORTED_MODULE_3__["default"])().catch(err => console.error('Could not connect to DB', err.message));

app.set('view engine', 'hbs');
app.use(_middleware__WEBPACK_IMPORTED_MODULE_7__["default"]);

io.on('connection', (socket) => {
  console.log('New user connected');
  Object(_socketEvent__WEBPACK_IMPORTED_MODULE_6__["default"])(socket, io);
});

app.use('/', _routes__WEBPACK_IMPORTED_MODULE_8__["default"]);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


/***/ }),

/***/ "./server/socketEvent.js":
/*!*******************************!*\
  !*** ./server/socketEvent.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/validation */ "./server/utils/validation.js");
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/message */ "./server/utils/message.js");
/* harmony import */ var _utils_users__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/users */ "./server/utils/users.js");




const users = _utils_users__WEBPACK_IMPORTED_MODULE_2__["default"].getInstance();

// update room list for people joining a room
const updateUserJoining = (io) => {
  io.emit('updateRoomList', { rooms: users.getRoomList() });
};

const joinRoom = (socket, io) => socket.on('join', (params, callback) => {
  if (!Object(_utils_validation__WEBPACK_IMPORTED_MODULE_0__["default"])(params.name) || !Object(_utils_validation__WEBPACK_IMPORTED_MODULE_0__["default"])(params.room)) {
    return callback('Name and Room name are required!');
  }

  const name = params.name.trim();
  const room = params.room.trim().toLowerCase();
  const user = users.getUser({ name });

  if (user && user.room === room) {
    return callback('Username taken!');
  }

  socket.join(room);
  users.removeUser(socket.id);
  users.addUser(socket.id, name, room);
  io.to(room).emit('updateUserList', users.getUserList(room));
  socket.emit('newMessage', Object(_utils_message__WEBPACK_IMPORTED_MODULE_1__["generateMessage"])('Admin', `Welcome to the room ${room}!`));
  socket.broadcast.to(room).emit('newMessage', Object(_utils_message__WEBPACK_IMPORTED_MODULE_1__["generateMessage"])('Admin', `${name} joined the chat`));

  updateUserJoining(io);
  return callback();
});

const createMessage = (socket, io) => socket.on('createMessage', (message, callback) => {
  const user = users.getUser({ id: socket.id });

  if (user && Object(_utils_validation__WEBPACK_IMPORTED_MODULE_0__["default"])(message.text)) {
    io.to(user.room).emit('newMessage', Object(_utils_message__WEBPACK_IMPORTED_MODULE_1__["generateMessage"])(user.name, message.text));
  }
  callback();
});

const createLocationMessage = (socket, io) => socket.on('createLocationMessage', (coords) => {
  const user = users.getUser({ id: socket.id });

  if (user) {
    io.to(user.room).emit('newLocationMessage', Object(_utils_message__WEBPACK_IMPORTED_MODULE_1__["generateLocationMessage"])(user.name, coords.latitude, coords.longitude));
  }
});

const disconnect = (socket, io) => socket.on('disconnect', () => {
  const user = users.removeUser(socket.id);

  io.to(user.room).emit('updateUserList', users.getUserList(user.room));
  io.to(user.room).emit('newMessage', Object(_utils_message__WEBPACK_IMPORTED_MODULE_1__["generateMessage"])('Admin', `${user.name} has left`));
  updateUserJoining(io);
});

const getRoomList = socket => socket.on('getRoomList', (_, callback) => {
  callback({ rooms: users.getRoomList() });
});

/* harmony default export */ __webpack_exports__["default"] = ((socket, io) => ({
  joinRoom: joinRoom(socket, io),
  createMessage: createMessage(socket, io),
  createLocationMessage: createLocationMessage(socket, io),
  disconnect: disconnect(socket, io),
  getRoomList: getRoomList(socket, io),
}));


/***/ }),

/***/ "./server/utils/helpers.js":
/*!*********************************!*\
  !*** ./server/utils/helpers.js ***!
  \*********************************/
/*! exports provided: catchAsyncError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "catchAsyncError", function() { return catchAsyncError; });
const catchAsyncError = fn => (req, res, next) => fn(req, res, next).catch(next);


/***/ }),

/***/ "./server/utils/message.js":
/*!*********************************!*\
  !*** ./server/utils/message.js ***!
  \*********************************/
/*! exports provided: generateMessage, generateLocationMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateMessage", function() { return generateMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateLocationMessage", function() { return generateLocationMessage; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);


const generateMessage = (from, text) => ({
  from,
  text,
  createdAt: moment__WEBPACK_IMPORTED_MODULE_0___default()().valueOf(),
});

const generateLocationMessage = (from, latitude, longitude) => ({
  from,
  url: `https://www.google.com/maps?q=${latitude},${longitude}`,
  createdAt: moment__WEBPACK_IMPORTED_MODULE_0___default()().valueOf(),
});


/***/ }),

/***/ "./server/utils/users.js":
/*!*******************************!*\
  !*** ./server/utils/users.js ***!
  \*******************************/
/*! exports provided: default, Users */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Singleton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Users", function() { return Users; });
class Users {
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

const Singleton = (() => {
  let instance;

  const createInstance = () => new Users();

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();




/***/ }),

/***/ "./server/utils/validation.js":
/*!************************************!*\
  !*** ./server/utils/validation.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const isRealString = string => typeof string === 'string' && string.trim().length > 0;

/* harmony default export */ __webpack_exports__["default"] = (isRealString);


/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "connect-ensure-login":
/*!***************************************!*\
  !*** external "connect-ensure-login" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("connect-ensure-login");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),

/***/ "validator/lib/isEmail":
/*!****************************************!*\
  !*** external "validator/lib/isEmail" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("validator/lib/isEmail");

/***/ })

/******/ });
//# sourceMappingURL=server.bundle.js.map