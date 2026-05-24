FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/backend ./packages/backend
COPY packages/shared ./packages/shared

RUN npm install

WORKDIR /app/packages/backend

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
