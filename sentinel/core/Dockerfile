FROM node:18-slim as base
WORKDIR /app
COPY package*.json ./
RUN npm install --production

FROM node:18-slim
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .

# Health Check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {if(r.statusCode !== 200) process.exit(1);})"

EXPOSE 8080
CMD ["node", "src/gateway.js"]
