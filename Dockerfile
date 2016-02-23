FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app/client
RUN mkdir -p /usr/src/app/server

# Install client dependencies
WORKDIR /usr/src/app/client
COPY client/package.json /usr/src/app/client/
RUN npm install
COPY client /usr/src/app/client/

# Install server dependencies
WORKDIR /usr/src/app/server
COPY server/package.json /usr/src/app/server/
RUN npm install
COPY server /usr/src/app/server/

WORKDIR /usr/src/app/server
CMD [ "npm", "start" ]