FROM node:20-alpine as base

FROM base as builder

WORKDIR /home/node/app
COPY package*.json ./

COPY . .
RUN npm install
RUN npm run build

FROM base as runtime

ENV NODE_ENV=production

WORKDIR /home/node/app
COPY package*.json ./

RUN npm install --production

COPY --from=builder /home/node/app/.next ./.next
COPY --from=builder /home/node/app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
