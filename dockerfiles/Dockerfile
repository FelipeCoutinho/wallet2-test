# build
FROM node:18-alpine AS builder
WORKDIR /app


RUN apk update && apk add python3 make g++

COPY package*.json ./
RUN npm ci --only=production
RUN npm prune --production
RUN npm install

COPY . ./
RUN npm run build
# release
FROM node:18-alpine
WORKDIR /app

# env vars
ENV NODE_ENV=production

# copy
COPY --from=builder /app/.package.*.txt /app/
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

# run
EXPOSE 3000
CMD ["node", "dist/main.js"]