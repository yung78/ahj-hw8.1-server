const http = require('http');
const Koa = require('koa');
const WS = require('ws');
const ab2str = require('arraybuffer-to-string');
const messages = require('./db/db');

const app = new Koa();

const port = 7070;
const server = http.createServer(app.callback());

const wsServer = new WS.Server({
  server,
});

// Временный кортеж онлайн клиентов
let tempUsersSet = new Set(['Bazinga78(default)']);

// Обновление кортежа онлайн клиентов (9с.)
setInterval(() => {
  messages.users = tempUsersSet;
  tempUsersSet = new Set(['Bazinga78(default)']);
}, 9000);

wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(ab2str(message));

    // Обработка пинга онлайн клиентов и отправка кортежа клиентов онлайн
    if (JSON.parse(ab2str(message)).ping) {
      tempUsersSet.add(JSON.parse(ab2str(message)).ping);
      ws.send(JSON.stringify({ users: [...messages.users] }));
    } else {
      // Обработка сообщений
      const decodingMessage = JSON.parse(ab2str(message)).data;
      messages.addMessage(decodingMessage);

      // Вывод сообщения клиентам онлайн
      Array.from(wsServer.clients)
        .filter((client) => client.readyState === WS.OPEN)
        .forEach((client) => client.send(JSON.stringify({ data: [decodingMessage] })));
    }
  });

  // Первая отправка массива сообщений и кортежа пользователей
  ws.send(JSON.stringify({ data: messages.data, users: [...messages.users] }));
});

server.listen(port, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('WORK');
});
