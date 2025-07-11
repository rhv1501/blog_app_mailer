require("dotenv").config();
const { getAllEmails } = require("./db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const cleanText = (text) => {
  if (!text) return "";

  return (
    text
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove CSS styles (inline and block)
      .replace(/style\s*=\s*["'][^"']*["']/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      // Remove markdown syntax
      .replace(/#+\s/g, "") // Headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
      .replace(/\*(.*?)\*/g, "$1") // Italic
      .replace(/`(.*?)`/g, "$1") // Inline code
      .replace(/```[\s\S]*?```/g, "") // Code blocks
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
      .replace(/!\[.*?\]\(.*?\)/g, "") // Images
      .replace(/>\s/g, "") // Blockquotes
      .replace(/[-*+]\s/g, "") // List items
      .replace(/\d+\.\s/g, "") // Numbered lists
      // Remove extra whitespace and newlines
      .replace(/\s+/g, " ")
      .trim()
  );
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
  }
};

async function sendEmailToAll(blog) {
  const subscriberEmails = await getAllEmails();

  const cleanDescription = cleanText(blog.description || blog.content || "");

  // Create a short excerpt (150 characters max for better readability)
  const excerpt =
    cleanDescription.length > 150
      ? cleanDescription.slice(0, 150) + "..."
      : cleanDescription;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; margin-bottom: 20px;">${blog.title}</h2>
      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${excerpt}</p>
      <a href="https://www.blog.rhv1501.me/blogs/${blog._id}" 
         style="display: inline-block; padding: 12px 24px; background-color: #007cba; color: white; text-decoration: none; border-radius: 5px;">
        Read Full Blog
      </a>
    </div>
  `;

  for (const email of subscriberEmails) {
    await sendEmail({
      to: email,
      subject: `🆕 New Blog Published: ${blog.title}`,
      html,
    });
  }
}

module.exports = {
  sendEmailToAll,
};
