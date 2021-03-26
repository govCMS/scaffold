const { src, dest, series, watch } = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

const options = {
  paths: {
    js: "source/js/**/*.js",
    sass: "source/sass/**/*.scss"
  }
};

/**
 * Create JavaScript production build.
 */
const jsProduction = () => {
  return src(options.paths.js)
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js"
      })
    )
    .pipe(dest("build/js/"));
};

/**
 * Create JavaScript development build.
 */
const jsDevelopment = () => {
  return src(options.paths.js)
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(
      rename({
        extname: ".min.js"
      })
    )
    .pipe(dest("build/js/"));
};

/**
 * Create CSS production build.
 */
const cssProduction = () => {
  return src(options.paths.sass)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(dest("build/css/"));
};

/**
 * Create CSS development build.
 */
const cssDevelopment = () => {
  return src(options.paths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./maps"))
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(dest("build/css/"));
};

/**
 * Watch function.
 *
 * Builds JavaScript and CSS assets in realtime as the source code is modified.
 */
const watching = () => {
  watch([options.paths.js], jsDevelopment);
  watch([options.paths.sass], cssDevelopment);
}

exports.default = series(jsProduction, cssProduction);
exports.prod = series(jsProduction, cssProduction);
exports.dev = series(jsDevelopment, cssDevelopment);
exports.watch = watching;