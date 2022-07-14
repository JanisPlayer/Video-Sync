FROM node:alpine

WORKDIR /apps
RUN npm install ws node-static
ADD index.js /apps/

EXPOSE 5001

ENTRYPOINT ["node", "index.js"]
