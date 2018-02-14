# Unused Images

List all images that are not referenced in your html and css. Images in HTML (or PHP) are found when used in the img[src] or img[data-src] attribute, as well as in the link[href] and meta[contact]. After being found, their names are matches starting from the first / to the end of the filename, if they have the following extension: .png, .gif, .jpg, .jpeg, .pdf, .xml, .apng, .svg or .mng.

Images with absolute urls will also be ignored.

## Show example

Stream all the images, css and html files and show, line by line, the image files not used in your html files.

	var gulp = require('gulp');
	var obsoleteImages = require('gulp-obsolete-images');

	gulp.task('clean:unused:show', function(){
	  return gulp.src(['app/images/**/*', '.tmp/styles/**/*.css', 'app/*.html', 'app/partials/**/*.html'])
	      .pipe(obsoleteImages({log: true}));
	});

## Delete example

Stream all the images, css and html files and delete all unused images.

	var gulp = require('gulp');
	var obsoleteImages = require('gulp-obsolete-images');

	gulp.task('clean:unused:show', function(){
	  return gulp.src(['app/images/**/*', '.tmp/styles/**/*.css', 'app/*.html', 'app/partials/**/*.html'])
	      .pipe(obsoleteImages({delete: true}));
	});

## Combination with confirm example:

First show all unused images, then prompt user whether to delete them. It uses two other plugins, so make sure you install them as well.

	var gulp = require('gulp');
	var obsoleteImages = require('gulp-obsolete-images');
	var confirm = require('gulp-confirm');
	var runSequence = require('run-sequence');

	// Clean unused images
	gulp.task('clean:unused:confirm', function(){
	  return gulp.src(['app/images/**/*', '.tmp/styles/**/*.css', 'app/*.html', 'app/partials/**/*.html'])
	    .pipe(confirm({
	      question: 'Above files will be deleted! Confirm (y)?',
	      input: '_key:y'
	    }))
	    .pipe(obsoleteImages({delete: true}));
	});

	// Show unused images
	gulp.task('clean:unused:show', function(){
	  return gulp.src(['app/images/**/*', '.tmp/styles/**/*.css', 'app/*.html', 'app/partials/**/*.html'])
	      .pipe(obsoleteImages({log: true}));
	});

	// Main task
	gulp.task('clean:unused', function(){
	  runSequence('clean:unused:show', ['clean:unused:confirm']);
	});
