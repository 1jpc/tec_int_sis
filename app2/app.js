const express = require('express');
const amqp = require('amqplib/callback_api');

const app = express();

const rabbitMQHost = 'amqp://rabbitmq';
const queue = 'messages';
let receivedMessages = [];

amqp.connect(rabbitMQHost, (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    channel.assertQueue(queue, { durable: false });
    console.log("Waiting for messages in", queue);

    channel.consume(queue, (msg) => {
      const message = msg.content.toString();
      console.log("Received message:", message);
      receivedMessages.push(message);
    }, { noAck: true });
  });
});

app.get('/', (req, res) => {
  let messagesHTML = '<ul>';
  receivedMessages.forEach((msg) => {
    messagesHTML += `<li>${msg}</li>`;
  });
  messagesHTML += '</ul>';
  
  res.send(`
    <html>
      <head>
        <title>Mensagens recebidas</title>
      </head>
      <body>
        <h1>Mensagens recebidas</h1>
        ${messagesHTML}
      </body>
    </html>
  `);
});

app.listen(3001, () => {
  console.log('funcionando porta 3001');
});