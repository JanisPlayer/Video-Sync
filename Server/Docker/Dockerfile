FROM node:10
RUN mkdir /apps

WORKDIR /apps
RUN wget https://raw.githubusercontent.com/JanisPlayer/Video-Sync/main/Server/package.json
RUN npm install
RUN npm install ws

EXPOSE 5001

ENTRYPOINT ["node", "index.js"]
