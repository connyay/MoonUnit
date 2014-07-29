module.exports = function(grunt) {

grunt.initConfig({
    execute: {
        target: {
            src: ['script.js']
        }
    }
})

  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('default', ['execute']);

};
