'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglifyjs');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const combiner = require('stream-combiner2').obj;
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('sass', function() {
	return combiner(
		gulp.src('src/scss/**/*.scss'),
		gulpIf(isDevelopment, sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError)),
		concat('main.css'),
		autoprefixer({
			browsers: ['last 50 versions'],
			cascade: false
		}),
		minifycss(),
		gulpIf(isDevelopment, sourcemaps.write()),
		gulp.dest('app/css')
	).on('error', notify.onError());
});

gulp.task('clean', function() {
	return del('app');
});

gulp.task('assets', function() {
	return gulp.src('src/assets/**', {since: gulp.lastRun('assets')})
		.pipe(newer('app'))
		.pipe(debug({title: 'assets'}))
		.pipe(gulp.dest('app'));
});

gulp.task('libs', function() {
	return gulp.src('src/js/libs/**/*.js')
		.pipe(newer('app'))
		.pipe(concat('libs.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./app/js/'));
});

gulp.task('js', function() {
	return gulp.src('src/js/*.js')
		.pipe(newer('app'))
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./app/js/'));
});

gulp.task('json', function() {
	return gulp.src('src/js/*.json')
		.pipe(newer('app'))
		.pipe(debug({title: 'json'}))
		.pipe(gulp.dest('./app/js/'));
});

gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('sass', 'js', 'libs', 'json', 'assets'))
);

gulp.task('watch', function() {
	gulp.watch('src/scss/**/*.*', gulp.series('sass'));
	gulp.watch('src/js/*.js', gulp.series('js'));
	gulp.watch('src/js/libs/*.js', gulp.series('libs'));
	gulp.watch('src/js/*.json', gulp.series('json'));
	gulp.watch('src/assets/**/*.*', gulp.series('assets'));
});

gulp.task('serve', function() {
	browserSync.init({
		server: 'app',
		port: 3000,
		ui: {
			port: 3001
		},
		notify: false
	});

	browserSync.watch('app/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
	gulp.series('build', gulp.parallel('watch', 'serve'))
);