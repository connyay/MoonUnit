module.exports = function(grunt) {

    grunt.initConfig({
        shell: {
            git: {
                command: function() {
                    grunt.log.writeln('Fixing git config');
                    return 'git config --global url."https://".insteadOf git://';
                }
            },
            npm: {
                command: function() {
                    grunt.log.writeln('Installing deps');
                    return 'cd client; npm install';
                }
            },
            build: {
                command: function() {
                    grunt.log.writeln('Running gulp');
                    return 'cd client; ./node_modules/gulp/bin/gulp.js build';
                }
            },
            docs: {
                command: function() {
                    grunt.log.writeln('Building docs');
                    return 'npm run docs';
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['shell:git', 'shell:npm', 'shell:build', 'shell:docs']);

};
