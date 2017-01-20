"use strict";

var gulp = require("gulp");
var connect = require("gulp-connect"); //runs the dev server 
var open = require("gulp-open"); // opens the web browser
var browserify = require('browserify'); //bundler
var reactify = require('reactify'); // jsx --> js
var source = require('vinyl-source-stream'); //use text stream with Gulp
var concat = require('gulp-concat');
var lint = require('gulp-eslint');

var config = {
	port: 9005,
	devBaseUrl: 'http://localhost',
	paths : {
		html: './src/*.html',
		js: './src/**/*.js',
		css : [
				'node_modules/bootstrap/dist/css/bootstrap.min.css',
				'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
				'./src/css/*.css'				
			],
		fonts: 'node_modules/bootstrap/dist/fonts/*',
		dist: './dist',
		mainJs: './src/main.js'
	}
}


// start the dev serevr
gulp.task('connect', function() {
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function() {
	gulp.src('dist/index.html')
		.pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }))
});

gulp.task('watch', function() {
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js','lint']);
	gulp.watch(config.paths.css, ['css']);
});

gulp.task('html',function(){
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('js', function(){
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

gulp.task('css', function() {
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'))
		.pipe(connect.reload());
});

gulp.task('fonts', function() {
	gulp.src(config.paths.fonts)
		.pipe(gulp.dest(config.paths.dist + '/fonts'))
})

gulp.task('lint',function(){
	return gulp.src(config.paths.js)
		.pipe(lint({config: 'eslint.config.json'}))
		.pipe(lint.format());

});

gulp.task('default', ['html','js','css','fonts','lint','open','watch']);