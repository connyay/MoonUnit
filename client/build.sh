#!/bin/bash

npm install --silent
./node_modules/bower/bin/bower install --silent
./node_modules/gulp/bin/gulp.js build
