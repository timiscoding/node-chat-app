# Node Chat app

A realtime chat app that lets users join rooms with the ability to send their location. Uses socket.io, node/express, jquery, moment, mustache and handlebars. This is a code along from [Complete Node Develop course](https://www.udemy.com/the-complete-nodejs-developer-course-2/)

## Enhancements
My own additions to the project

* Bundling server and client with webpack, refactoring to ES6 and eslinting
* Join page shows a list of active rooms in a dropdown
* Prevent clients joining a room with the same user name
* Clients can leave room
* Room names are case-insensitive
* Trim spaces from room names and user names

## Demo

<a href="https://chat-app-timiscoding.herokuapp.com/" target="blank">Try it out on Heroku</a>

## Build

```
npm i
npm start
```
