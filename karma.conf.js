/* eslint-disable */
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
        './app/example.js','./test/user/example.spec.js'
    ],


    // list of files to exclude
    exclude: [
        './coverage/*'
    ],


    // preprocess matching files before serving them to the browser
    preprocessors: {
        './app/example.js': ['coverage']
    },


    // test results reporter to use
    reporters: ['spec', 'coverage', 'coveralls'],

    coverageReporter: {
        type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
        dir: 'coverage/'
    },


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