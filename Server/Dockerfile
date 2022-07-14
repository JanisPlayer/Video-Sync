FROM node:10
RUN mkdir /apps

WORKDIR /apps
COPY package.json /apps/
RUN npm install

EXPOSE 5001

ENTRYPOINT ["node", "index.js"]
