FROM node:16

WORKDIR /apps
RUN npm install ws
ADD index.js /apps/
ADD package.json /apps/

EXPOSE 5001

ENTRYPOINT ["node", "index.js"]
