FROM node:16

EXPOSE 4000

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build && chmod a+x /usr/src/app/dockerEntrypoint.sh

ENTRYPOINT [ "/usr/src/app/dockerEntrypoint.sh" ]
CMD ["npm", "start"]
