FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/frontend ./packages/frontend
COPY packages/shared ./packages/shared

RUN npm install

WORKDIR /app/packages/frontend

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
