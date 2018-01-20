FROM node:8.9.1

# Create app directory

COPY . /starter
COPY package.json /starter/package.json
COPY .env.example /starter/.env

WORKDIR /starter

RUN npm -v 
RUN node -v
RUN npm install -g yarn
RUN apt-get update 
RUN apt-get install net-tools -y
RUN ifconfig
RUN yarn install 

CMD ["npm", "start"]

EXPOSE 8888
