FROM node:14-alpine

WORKDIR /app/src

COPY . .

RUN yarn

CMD ["node", "bin/www"]
