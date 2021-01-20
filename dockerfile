FROM node:8
WORKDIR /usr/TMS
COPY package.json .
RUN npm install\
  && npm install typescript -g
COPY . .
RUN tsc
CMD ["node", "./build/src/server.js"];