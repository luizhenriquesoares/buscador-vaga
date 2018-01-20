#!/bin/bash

sudo apt-get update 
sudo apt-get install curl
sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install yarn -g
sudo npm install mocha -g
sudo npm install pm2 -g
sudo yarn install

