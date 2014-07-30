#!/bin/bash

cd client
npm install
npm install -g bower
npm install -g gulp
bower install
gulp build
