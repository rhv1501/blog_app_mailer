const amqplib = require("amqplib");

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672/";
const QUEUE_NAME = "blogEmailQueue";

let connection = null;
let channel = null;


async function getChannel() {
  if (channel) return channel;

  try {
    if (!connection) {
      connection = await amqplib.connect(RABBITMQ_URL);
    }

    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    return channel;
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ:", error);
    throw error;
  }
}


async function enqueueEmailJob(blog) {
  const ch = await getChannel();
  ch.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(blog)), {
    persistent: true,
  });
}

module.exports = {
  getChannel,
  enqueueEmailJob,
};
