#!/bin/bash

set -o errexit # Exit on error

npm install
./node_modules/gulp/bin/gulp.js bower
./node_modules/gulp/bin/gulp.js build
gulp build
