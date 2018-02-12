note: with this fork I want to achieve the following:

remove the forced output

remove support for angular image source

add support for data-src attribute commonly used in lazy-loading

# Unused Images

List all images that are not referenced in your html and css. Images in HTML (or PHP) are found when used in the img[src] or img[data-src] attribute, as well as in the link[href] and meta[contact]. After being found, their names are matches starting from the first / to the end of the filename, if they have the following extension: .png, .gif, .jpg, .jpeg, .pdf, .xml, .apng, .svg or .mng.

Images with absolute urls will also be ignored.

## Show example

Stream all the images, css and html files that you have into it, it emits errors, so use plumber to catch and see them

	gulp.task('clean:unused:show', function(){
	  return gulp.src(['app/images/**/*', '.tmp/styles/**/*.css', 'app/*.html', 'app/partials/**/*.html'])
	      .pipe(obsoleteImages({log: true}));
	});

## Delete example

	gulp.task('clean:unused:show', function(){
	  return gulp.src(['app/images/**/*', '.tmp/styles/**/*.css', 'app/*.html', 'app/partials/**/*.html'])
	      .pipe(obsoleteImages({delete: true}));
	});

## Combination with confirm example:

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
