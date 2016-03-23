'use strict';
var recursive = require('recursive-readdir');
var replace = require('replace');
var Q = require('q');
module.exports = function(gulp, options) {
  var count = 0;
  var deferred = Q.defer();

  function updateFileReferences(rootFolder) {
    recursive('./dist/' + rootFolder, function(err, files) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var currentFile = (file.split('-' + rootFolder).join(''));
        var filename = currentFile.replace(/^.*[\\\/]/, '');
        var newFilename = (filename.split('.').join('-' + rootFolder + '.'));
        var textFilesOnly = [];
        for (var j = 0; j < files.length; j++) {
          var ext = files[j].replace(/^.*[\\\/]/, '').split('.')[1];
          if (ext === 'js' || ext === 'html') {
            textFilesOnly.push(files[j]);
          }
        }
        replace({
          regex: filename,
          replacement: newFilename,
          paths: textFilesOnly,
          recursive: false,
          silent: true
        });
      }
      count++;
      console.log("count", count);
      if (count === options.folders.length) {
        deferred.resolve();
      }
    });
  }
  return function(cb) {
    count = 0;
    deferred = Q.defer();
    for (var i = 0; i < options.folders.length; i++) {
      updateFileReferences(options.folders[i]);
    }
    return deferred.promise;
  }
};