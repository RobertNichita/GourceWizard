// TODO: This is temporary! Eventually this will be done by the API server.

import amqp = require('amqplib');
import {v4 as uuid} from 'uuid';

async function produce(msg: String): Promise<void> {
  console.log(`Producer sending message ${msg} to consumer.`);
  const url = 'amqp://localhost:5672'; // TODO: ENV VAR

  const queue = 'render';

  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();

  channel.assertQueue(queue, {
    durable: true,
  });

  channel.sendToQueue(queue, Buffer.from(msg), {
    persistent: true,
  });
}

// Send valid request
const payload = {
  renderType: 'gource',
  repoURL: 'https://github.com/Raieen/Raieen.git',
  videoId: uuid(),
};

produce(JSON.stringify(payload));

// Send invalid message
// produce(`Producer ${Date().toString()}`);
