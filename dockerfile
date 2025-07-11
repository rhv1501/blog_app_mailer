FROM node:18-alpine


WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .


ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S worker -u 1001
USER worker


CMD ["pnpm", "run","start"]