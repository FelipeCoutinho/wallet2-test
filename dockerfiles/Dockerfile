# build
FROM node:18 AS builder
WORKDIR /app

RUN apk update && apk add python3 make g++

COPY package*.json ./
RUN npm ci --only=production
RUN npm prune --production

RUN rm -f .npmrc

COPY . ./

# release
FROM node:18
WORKDIR /app

# env vars
ENV NODE_ENV=production

# copy
COPY --from=builder /app/newrelic.js /app/
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/src /app/src

# run
EXPOSE 3000
CMD ["node", "src/main.js"]
