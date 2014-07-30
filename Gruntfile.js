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
            bower: {        
                command: function() {          
                    grunt.log.writeln('Installing bower');          
                    return 'cd client; ./node_modules/gulp/bin/gulp.js bower';       
                }      
            },
            build: {        
                command: function() {          
                    grunt.log.writeln('Running gulp');          
                    return 'cd client; ./node_modules/gulp/bin/gulp.js build';        
                }      
            }    
        }
    })

    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['shell:git', 'shell:npm', 'shell:bower', 'shell:build']);

};