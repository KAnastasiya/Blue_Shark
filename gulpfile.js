const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const webpack = require('webpack-stream');
const named = require('vinyl-named');
const plugins = require('gulp-load-plugins')();

const SRC = 'src';
const PUBLIC = './';


// Pug
gulp.task('pug', () =>
  gulp
    .src(`${SRC}/*.pug`)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError()
    }))
    .pipe(plugins.pug())
    .pipe(gulp.dest(PUBLIC))
);


// Styles
gulp.task('scss', () =>
  gulp
    .src(`${SRC}/*.scss`)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError()
    }))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(plugins.autoprefixer(
      ['last 2 versions', '> 1%'],
      { cascade: false }
      ))
    .pipe(plugins.cssnano())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(PUBLIC))
);


// Scripts
gulp.task('js', () =>
  gulp
    .src(`${SRC}/*.js`)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError(err => ({
        title: 'Webpack',
        message: err.message
      }))
    }))
    .pipe(named())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(PUBLIC))
);


// Images
gulp.task('img', () =>
  gulp
    .src([`${SRC}/blocks/**/img/*.*`, `${SRC}/common/img/*.*`])
    .pipe(plugins.imagemin([
      imageminJpegRecompress({
        loops: 4,
        min: 50,
        max: 65,
        quality: 'high',
        strip: true,
        progressive: true
      }),
      imageminPngquant({quality: '50-80'})
    ]))
    .pipe(gulp.dest(`${PUBLIC}/img`))
);


// Icons
gulp.task('icon', () =>
  gulp
    .src([`${SRC}/blocks/**/icon/*.*`, `${SRC}/common/icon/*.*`])
    .pipe(plugins.imagemin([
      imageminSvgo({
        plugins: [
          { removeViewBox: false }
        ]
      })
    ]))
    .pipe(gulp.dest(`${PUBLIC}/icon`))
);


// Fonts
gulp.task('fonts', () =>
  gulp
    .src([`${SRC}/fonts/**/*`])
    .pipe(gulp.dest(`${PUBLIC}/fonts`))
);


// Clean
gulp.task('cleanImg', () => del(`${PUBLIC}/img`));
gulp.task('cleanIcon', () => del(`${PUBLIC}/icon`));
gulp.task('cleanFonts', () => del(`${PUBLIC}/fonts`));

gulp.task('clean', gulp.parallel('cleanImg', 'cleanIcon', 'cleanFonts'));


// Server
gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: PUBLIC,
      index: 'index.html'
    },
    port: 8800,
    open: false,
    reloadOnRestart: true,
    reloadDelay: 2000,
  });
});


// Watch
gulp.task('watch', () => {
  gulp.watch([
    `${SRC}/blocks/**/*.pug`,
    `${SRC}/common/pug/*.pug`,
    `${SRC}/index.pug`
  ]).on('change', gulp.series('pug', browserSync.reload));

  gulp.watch([
    `${SRC}/blocks/**/*.scss`,
    `${SRC}/common/scss/*.scss`,
    `${SRC}/style.scss`
  ]).on('change', gulp.series('scss', browserSync.reload));

  gulp.watch([
    `${SRC}/blocks/**/*.js`,
    `${SRC}/common/js.js`,
    `${SRC}/script.js`
  ]).on('change', gulp.series('js', browserSync.reload));

  gulp.watch([
    `${SRC}/blocks/**/img/*`,
    `${SRC}/common/img/*`
  ]).on('change', gulp.series('cleanImg', 'img', browserSync.reload));

  gulp.watch([
    `${SRC}/blocks/**/icon/*`,
    `${SRC}/common/icon/*`
  ]).on('change', gulp.series('cleanIcon', 'icon', browserSync.reload));

  gulp.watch([
    `${SRC}/fonts/**/*`
  ]).on('change', gulp.series('cleanFonts', 'fonts', browserSync.reload));
});


// Default
gulp.task('default', gulp.series(
  gulp.parallel('clean'),
  gulp.parallel('img', 'icon', 'fonts', 'pug', 'scss'),
  gulp.parallel('server', 'watch')
  )
);
