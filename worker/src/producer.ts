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
  renderType: 'GOURCE',
  repoURL: 'https://github.com/Raieen/Raieen.git',
  // repoURL: 'https://github.com/scikit-learn/scikit-learn',
  // repoURL: 'https://github.com/linux-kernel-mirror/linux-stable.git',
  videoId: `manual-test-${uuid()}`,
};

// https://github.com/linux-kernel-mirror/linux-stable.git
// for (let index = 0; index < 50; index++) {
produce(JSON.stringify(payload));
// }

// Send invalid message
// produce(`Producer ${Date().toString()}`);
