'use strict';
var merge = require('merge-stream');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var rename = require('gulp-rename');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Root directory of folders to parse.
 * @returns {Function}
 */
module.exports = function(gulp, options) {
  function appendFileNamesInFolder(entry, rootFolder) {
    return gulp.src(entry + '/' + rootFolder + '/**/*.*')
      .pipe(vinylPaths(del))
      .pipe(rename(function(path) {
        path.basename += '-' + rootFolder;
      }))
      .pipe(gulp.dest(entry + '/' + rootFolder + '/'));
  }
  return function() {
    var tasks = [];
    for (var i = 0; i < options.folders.length; i++) {
      tasks.push(appendFileNamesInFolder(options.entry, options.folders[i]));
    }
    return merge(tasks);
  };
};