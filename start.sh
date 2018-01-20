#!/bin/bash

node populate.js
sudo pm2 start app.js
