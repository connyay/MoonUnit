#!/bin/bash

cd client
npm install
./node_modules/bower/bin/bower install
./node_modules/gulp/bin/gulp.js build


tail ../server/public/assets/javascripts/app.js
