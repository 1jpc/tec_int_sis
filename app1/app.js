const express = require('express');
const amqp = require('amqplib/callback_api');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const rabbitMQHost = 'amqp://rabbitmq';
const queue = 'messages';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/send', (req, res) => {
  const message = req.body.message;

  amqp.connect(rabbitMQHost, (err, connection) => {
    if (err) {
      throw err;
    }
    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }
      channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(message));
      console.log("Mensagem enviada:", message);
      res.send('Mensagem enviada: ' + message);
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  });
});

app.listen(3000, () => {
  console.log('funcionando porta 3000');
});