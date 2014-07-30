#!/bin/bash

cd client
npm install
./node_modules/gulp/bin/gulp.js bower
./node_modules/gulp/bin/gulp.js build
