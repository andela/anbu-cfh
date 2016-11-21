<<<<<<< HEAD
/* eslint-disable */
=======
>>>>>>> 305e37004212b42b5db918608d745b5961350831
// Karma configuration....................................................................................................................................................
// Generated on Wed Nov 16 2016 10:45:57 GMT+0100 (WAT)

module.exports = function(config) {

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        './test/user/example.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    preprocessors: {
    },


    // test results reporter to use
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    logLevel: config.LOG_INFO,


    autoWatch: true,

    
    // other things
 
    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },

    // start these browsers
    browsers: process.env.TRAVIS ? ['Chrome_travis_ci']: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
