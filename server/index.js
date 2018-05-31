/* eslint-disable no-console */

import server, { io } from './server';

const port = process.env.PORT || 3000;

let cServer = server;
let cIo = io;

if (module.hot) {
  module.hot.accept('./server', () => {
    console.log('Re-attaching event listeners to updated server module');
    cServer.close();
    server.listen(port);
    cServer = server;

    cIo.close();
    io.attach(cServer);
    cIo = io;
  });
}

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
