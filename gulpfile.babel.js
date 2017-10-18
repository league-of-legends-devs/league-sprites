import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import runSequence from 'run-sequence';
import del from 'del';

gulp.task('clean', () =>
  del([
    'lib',
  ]),
);

gulp.task('lint', () =>
  gulp
    .src([
      'src/**/*.js',
      'lib/**/*.js',
      '!node_modules/**',
    ])
    .pipe(eslint())
    .pipe(eslint.format('node_modules/eslint-formatter-pretty'))
    .pipe(eslint.failAfterError()),
);

gulp.task('build', () =>
  gulp
    .src('src/**/*.js')
    .pipe(babel({
      presets: ['env', 'stage-0'],
      plugins: ['transform-runtime'],
    }))
    .pipe(gulp.dest('lib')),
);

gulp.task('default', (callback) => {
  runSequence(
    'clean',
    'lint',
    'build',
    callback,
  );
});
