"use strict";

const sass = require("gulp-sass")(require("sass"));
const gulp = require("gulp");
const gutil = require("gulp-util");
const sourcemaps = require("gulp-sourcemaps");
const fileinclude = require("gulp-file-include");
const autoprefixer = require("gulp-autoprefixer");
const bs = require("browser-sync").create();
const rimraf = require("rimraf");
const comments = require("gulp-header-comment");
const jshint = require("gulp-jshint");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");

var path = {
  src: {
    html: "source/*.html",
    others: "source/*.+(php|ico|png)",
    htminc: "source/partials/**/*.htm",
    incdir: "source/partials/",
    plugins: "source/plugins/**/*.*",
    js: "source/js/*.js",
    scss: "source/scss/**/*.scss",
    images: "source/images/**/*.+(png|jpg|gif|svg)",
    fonts: "source/fonts/**/*.+(eot|ttf|woff|woff2|otf)",
  },
  build: {
    dirBuild: "theme/",
    dirDev: "theme/",
  },
};

// HTML
gulp.task("html:build", function () {
  return gulp
    .src(path.src.html)
    .pipe(customPlumber("Error Running html-include"))
    .pipe(
      fileinclude({
        basepath: path.src.incdir,
      })
    )
    .pipe(
 
    )
    .pipe(gulp.dest(path.build.dirDev))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});


gulp.task("scss:build", function () {
  return gulp
    .src(path.src.scss)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("/"))
    .pipe(
    
    .pipe(gulp.dest(path.build.dirDev + "css/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});


gulp.task("js:build", function () {
  return gulp
    .src(path.src.js)
    .pipe(jshint("./.jshintrc"))
    .pipe(
      notify(function (file) {
        if (!file.jshint.success) {
          return (
            file.relative + " (" + file.jshint.results.length + " errors)\n"
          );
        }
      })
    )
    .pipe(jshint.reporter("jshint-stylish"))
    .on("error", gutil.log)
    .pipe(
  
    )
    .pipe(gulp.dest(path.build.dirDev + "js/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});


gulp.task("images:build", function () {
  return gulp
    .src(path.src.images)
    .pipe(gulp.dest(path.build.dirDev + "images/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});


gulp.task("fonts:build", function () {
  return gulp
    .src(path.src.fonts)
    .pipe(gulp.dest(path.build.dirDev + "fonts/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Plugins
gulp.task("plugins:build", function () {
  return gulp
    .src(path.src.plugins)
    .pipe(gulp.dest(path.build.dirDev + "plugins/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});


gulp.task("others:build", function () {
  return gulp.src(path.src.others).pipe(gulp.dest(path.build.dirDev));
});


gulp.task("clean", function (cb) {
  rimraf("./theme", cb);
});


function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
   
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Glass",
    }),
  });
}

gulp.task("watch:build", function () {
  gulp.watch(path.src.html, gulp.series("html:build"));
  gulp.watch(path.src.htminc, gulp.series("html:build"));
  gulp.watch(path.src.scss, gulp.series("scss:build"));
  gulp.watch(path.src.js, gulp.series("js:build"));
  gulp.watch(path.src.images, gulp.series("images:build"));
  gulp.watch(path.src.fonts, gulp.series("fonts:build"));
  gulp.watch(path.src.plugins, gulp.series("plugins:build"));
});

gulp.task(
  "default",
  gulp.series(
    "clean",
    "html:build",
    "js:build",
    "scss:build",
    "images:build",
    "fonts:build",
    "plugins:build",
    "others:build",
    gulp.parallel("watch:build", function () {
      bs.init({
        server: {
          baseDir: path.build.dirDev,
        },
      });
    })
  )
);

gulp.task(
  "build",
  gulp.series(
    "html:build",
    "js:build",
    "scss:build",
    "images:build",
    "fonts:build",
    "plugins:build"
  )
);
