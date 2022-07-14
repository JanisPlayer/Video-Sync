FROM node:alpine

WORKDIR /apps
RUN npm install ws node-static
ADD server.js /apps/

EXPOSE 5001

ENTRYPOINT ["node", "server.js"]
