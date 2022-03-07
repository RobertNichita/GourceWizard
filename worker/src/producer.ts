// TODO: This is temporary! Eventually this will be done by the API server.

import amqp = require('amqplib');

async function produce(msg: String): Promise<void> {
    const url = 'amqp://localhost:5672'; // TODO: ENV VAR

    const queue = 'render';

    const conn = await amqp.connect(url);
    const channel = await conn.createChannel();

    channel.assertQueue(queue, {
        durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true
    });
};

// TODO: Figure out inputs/outputs
// gource -r 25 -c 4 -s 0.1 --key -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4     
const payload = {
    repo: {
        type: 'git',
        git: {
            url: 'https://github.com/Raieen',
        }
    },
    options: {
        gource: {
            lorem: 'ipsum'
        },
        ffmpeg: {
            'lorem': 'ipsum'
        }
    }
};
// produce(JSON.stringify(payload));

produce(`Producer ${Date().toString()}`);