const { getAllEmails } = require("./db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


async function sendEmailToAll(blog) {
  const subscriberEmails = await getAllEmails();

  const html = `
    <h2>${blog.title}</h2>
    <p>${blog.excerpt || ""}</p>
    <a href="${blog.url}">Read Full Blog</a>
  `;

  for (const email of subscriberEmails) {
    await sendEmail({
      to: email,
      subject: `🆕 New Blog Published: ${blog.title}`,
      html,
    });
    console.log(`✅ Email sent to ${email}`);
  }
}


module.exports = {
  sendEmailToAll,
};
