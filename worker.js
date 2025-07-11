require("dotenv").config();
const { getChannel } = require("./lib/queue");
const { sendEmailToAll } = require("./lib/email");
console.log("Using RabbitMQ URL:", process.env.RABBITMQ_URL);

async function startWorker() {
  const channel = await getChannel();

  const QUEUE_NAME = "blogEmailQueue";

  console.log("📬 Worker listening on queue:", QUEUE_NAME);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg !== null) {
      const blog = JSON.parse(msg.content.toString());
      console.log("📨 Processing blog:", blog.title);
      console.log("blog:", blog);

      try {
        await sendEmailToAll(blog);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Failed to send emails:", err);
        // optionally: channel.nack(msg);
      }
    }
  });
}

startWorker().catch(console.error);
