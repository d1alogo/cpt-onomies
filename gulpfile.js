// Require all the things (that we need)
var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sort = require('gulp-sort');
var watch = require('gulp-watch');
var wp_pot = require('gulp-wp-pot');

// Define the source paths for each file type
var src = {
    scss: ['assets/scss/**/*'],
	js: ['assets/js/**/*.js','!assets/js/*.min.js']
};

// Define the destination paths for each file type
var dest = {
	scss: 'assets/css',
	js: 'assets/js'
};

// Compile the SASS
gulp.task( 'sass', function() {
	gulp.src(src.scss)
		.pipe(sass({
			outputStyle: 'compressed'
		})
		.on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(dest.scss));
});

// Minify the JS
gulp.task( 'js', function() {
	gulp.src(src.js)
		.pipe(minify({
			mangle: false,
			ext:{
				min:'.min.js'
			}
		}))
		.pipe(gulp.dest(dest.js))
});
gulp.task("php", function () {
    gulp.start("serve");
});
// Create the .pot translation file
gulp.task( 'translate', function() {
	gulp.src(src.php)
		.pipe(sort())
		.pipe(wp_pot({
			domain: 'cpt-onomies',
			destFile:'cpt-onomies.pot',
			package: 'cpt-onomies',
			bugReport: 'https://github.com/d1alogo/cpt-onomies.git',
			lastTranslator: 'Labs <labs-dev@gmail.com>',
			team: 'Labs <labs-dev@gmail.com>',
			headers: false
		}))
		.pipe(gulp.dest('languages'));
});

// Watch the files
gulp.task( 'watch', function() {
	gulp.watch(src.scss,['sass']);
	gulp.watch(src.js,['js']);
	gulp.watch(src.php,['translate','php']);
});

// Test things out
gulp.task( 'test', ['php'] );

// Compile our assets
gulp.task( 'compile', ['sass','js'] );

// Let's get this party started
gulp.task( 'default', ['compile','translate','test'] );