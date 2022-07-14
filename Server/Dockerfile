FROM node:10
RUN mkdir /apps

WORKDIR /apps
ADD ./package.json /src/package.json
RUN npm install

EXPOSE 5001

ENTRYPOINT ["node", "index.js"]
