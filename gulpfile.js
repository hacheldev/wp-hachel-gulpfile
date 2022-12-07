"use strict";

const themeconfig = require("./themeconfig.json");

const through2 = require("through2");
const dotenv = require("dotenv");
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCss = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const wpPot = require("gulp-wp-pot");

dotenv.config();

function is_wpdev() {
	let wpEnv = process.env.WP_ENV;
	let allowedValues = ["development", "dev"];
	return allowedValues.includes(wpEnv) ? true : false;
}

function copyExternalLibrary(done) {
	console.log("\x1b[34m%s\x1b[0m", "Copy external library...");
	return themeconfig.externalLibrary.map((file) => {
		return gulp
			.src(file.src)
			.pipe(
				file.single
					? rename({ basename: file.name })
					: through2.obj()
			)
			.pipe(gulp.dest(file.dest))
			.on("end", () => {
				console.log(
					"\x1b[32m%s\x1b[0m",
					file.name + " copied successfully!"
				);
				done();
			});
	});
}

function buildStyles(done) {
	console.log("\x1b[34m%s\x1b[0m", "Compiling styles...");
	return themeconfig.stylesFiles.map((file) => {
		return gulp
			.src(file.src)
			.pipe(!is_wpdev ? sourcemaps.init() : through2.obj())
			.pipe(sass())
			.pipe(
				postcss([
					require("postcss-import"),
					require("tailwindcss"),
					require("autoprefixer"),
				])
			)
			.pipe(!is_wpdev() ? cleanCss() : through2.obj())
			.pipe(
				rename(function (path) {
					path.basename = file.name;
					if (!is_wpdev()) {
						path.basename += ".min";
					}
				})
			)
			.pipe(
				!is_wpdev
					? sourcemaps.write(".")
					: through2.obj()
			)
			.pipe(gulp.dest(file.dest))
			.on("end", () => {
				console.log(
					"\x1b[32m%s\x1b[0m",
					"Styles compiled"
				);
				done();
			});
	});
}

function buildScripts(done) {
	console.log("\x1b[34m%s\x1b[0m", "Compiling scripts...");
	return themeconfig.scriptsFiles.map((file) => {
		return gulp
			.src(file.src)
			.pipe(concat(file.name + ".js"))
			.pipe(!is_wpdev() ? uglify() : through2.obj())
			.pipe(
				rename(function (path) {
					path.basename = file.name;
					if (!is_wpdev()) {
						path.basename += ".min";
					}
				})
			)
			.pipe(gulp.dest(file.dest))
			.on("end", () => {
				console.log(
					"\x1b[32m%s\x1b[0m",
					"Scripts compiled"
				);
				done();
			});
	});
}

function generatePot(done) {
	console.log("\x1b[34m%s\x1b[0m", "Generating translation file...");
	return themeconfig.makepotFiles.map((file) => {
		return gulp
			.src(file.src)
			.pipe(
				wpPot({
					domain: file.domain,
					package: file.package,
				})
			)
			.pipe(
				rename({
					basename: file.domain,
					extname: ".pot",
				})
			)
			.pipe(gulp.dest(file.dest))
			.on("end", () => {
				console.log(
					"\x1b[32m%s\x1b[0m",
					".pot generate"
				);
				done();
			});
	});
}

function watch() {
	console.log("\x1b[34m%s\x1b[0m", "Watcher launched...");
	const stylesFiles = themeconfig.stylesFiles.map((file) => file.src);
	const scriptsFiles = themeconfig.scriptsFiles.map((file) => file.src);
	const potFiles = themeconfig.makepotFiles.map((file) => file.src);

	gulp.watch(stylesFiles, gulp.series(buildStyles));
	gulp.watch(scriptsFiles, gulp.series(buildScripts));
	gulp.watch(potFiles, gulp.series(generatePot));
}

exports.build = gulp.series(
	copyExternalLibrary,
	buildStyles,
	buildScripts,
	generatePot
);
exports.copyExternalLibrary = copyExternalLibrary;
exports.buildStyles = buildStyles;
exports.buildScripts = buildScripts;
exports.generatePot = generatePot;
exports.watch = watch;
