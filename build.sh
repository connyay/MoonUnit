#!/bin/bash

cd client
npm install
./node_modules/gulp/bin/gulp.js build

#sorry
sleep 3

tail ../server/public/assets/javascripts/app.js
