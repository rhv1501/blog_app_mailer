# Blog Email Worker 📧

A Node.js worker service that processes blog notifications from a RabbitMQ queue and sends email notifications to all subscribers using MongoDB and Gmail SMTP.

## 🏗️ Architecture

This is a background worker service that:

- Listens to a RabbitMQ queue for new blog posts
- Fetches subscriber emails from MongoDB
- Sends clean, formatted email notifications via Gmail SMTP
- Processes markdown/HTML content and creates readable excerpts

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password
- CloudAMQP account (or local RabbitMQ)
- Docker (for containerized deployment)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd blog_app_email_worker
npm install -g pnpm
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RABBITMQ_URL=amqps://<username>:<password>@<host>/<vhost>
```

### 3. Run the Worker

```bash
# Development
pnpm start

# Or directly
node worker.js
```

## 📁 Project Structure

```
blog_app_email_worker/
├── lib/
│   ├── db.js          # MongoDB connection and email queries
│   ├── email.js       # Email sending logic with content cleaning
│   └── queue.js       # RabbitMQ connection setup
├── worker.js          # Main worker process
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (not in git)
├── .dockerignore     # Docker ignore file
├── dockerfile        # Docker configuration
└── README.md         # This file
```

## 📊 Dependencies

### Core Dependencies

- **amqplib**: RabbitMQ client for queue processing
- **mongodb**: MongoDB driver for database operations
- **nodemailer**: Email sending via SMTP
- **dotenv**: Environment variable management

### Dev Dependencies

- **nodemon**: Development auto-restart

## 🔧 Configuration

### MongoDB Setup

Your MongoDB should have a collection named `emails` with documents in this format:

```json
{
  "_id": "...",
  "email": "subscriber@example.com"
}
```

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password in `EMAIL_PASSWORD`

### RabbitMQ Queue

The worker listens to a queue named `blogEmailQueue` expecting messages in this format:

```json
{
  "_id": "blog-id",
  "title": "Blog Title",
  "description": "Blog content with HTML/Markdown...",
  "content": "Alternative content field"
}
```

## 📧 Email Features

### Content Cleaning

The worker automatically cleans blog content by removing:

- HTML tags and CSS styles
- Markdown formatting (headers, bold, italic, links, code blocks)
- Extra whitespace and newlines

### Email Template

Sends responsive HTML emails with:

- Clean blog title
- 150-character excerpt
- "Read Full Blog" button linking to your blog
- Professional styling

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t blog-email-worker .
```

### Run Container

```bash
docker run -d \
  --name blog-email-worker \
  -e MONGO_URI="your_mongo_uri" \
  -e EMAIL="your_email" \
  -e EMAIL_PASSWORD="your_password" \
  -e RABBITMQ_URL="your_rabbitmq_url" \
  blog-email-worker
```

### Using Environment File

```bash
docker run -d --env-file .env blog-email-worker
```

## 🔍 Monitoring

### Console Output

The worker provides detailed logging:

```
Using RabbitMQ URL: amqps://...
📬 Worker listening on queue: blogEmailQueue
📨 Processing blog: Your Blog Title
✅ Email sent to subscriber1@example.com
✅ Email sent to subscriber2@example.com
```

### Error Handling

- Failed email sends are logged but don't crash the worker
- Database connection errors are handled gracefully
- RabbitMQ messages are acknowledged only after successful processing

## 🔒 Security Best Practices

- ✅ Runs as non-root user in Docker
- ✅ Environment variables for sensitive data
- ✅ No hardcoded credentials
- ✅ App passwords for Gmail (not main password)
- ✅ Frozen lockfile for reproducible builds

## 🚀 Production Deployment

### Azure Container Instances

```bash
az container create \
  --resource-group myResourceGroup \
  --name blog-email-worker \
  --image your-registry/blog-email-worker \
  --environment-variables \
    MONGO_URI="..." \
    EMAIL="..." \
    EMAIL_PASSWORD="..." \
    RABBITMQ_URL="..."
```

### Environment Variables for Production

Never commit `.env` to version control. Use:

- Azure Key Vault
- Docker secrets
- Container environment variables

## 🛠️ Development

### Testing Database Connection

```bash
node lib/db.js
```

### Testing Email Configuration

The email module verifies SMTP connection on startup.

### Package Scripts

```json
{
  "start": "node worker.js",
  "dev": "nodemon worker.js"
}
```

## 📈 Scaling Considerations

- Multiple worker instances can process the same queue
- RabbitMQ handles message distribution
- Consider rate limiting for email sending
- Monitor Gmail's sending limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**ECONNREFUSED on email sending:**

- Check Gmail credentials
- Verify App Password is correct
- Ensure 2FA is enabled

**MongoDB connection fails:**

- Verify MONGO_URI format
- Check network connectivity
- Ensure database exists

**RabbitMQ connection issues:**

- Verify RABBITMQ_URL format
- Check CloudAMQP instance status
- Ensure queue exists

### Debug Mode

Set environment variable for verbose logging:

```bash
DEBUG=* node worker.js
```

## 📞 Support

For issues and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review logs for error details
