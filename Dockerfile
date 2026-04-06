FROM node:20-alpine

WORKDIR /app

# Only copy what's needed — no node_modules (zero dependencies)
COPY package.json ./
COPY src/ ./src/

EXPOSE 3000

ENV PORT=3000

CMD ["node", "src/server.js"]
