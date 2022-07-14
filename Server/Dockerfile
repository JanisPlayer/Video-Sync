FROM node:10
RUN mkdir /apps

WORKDIR /apps
COPY package.json /apps/package.json
RUN npm install

EXPOSE 5001

ENTRYPOINT ["node", "index.js"]
