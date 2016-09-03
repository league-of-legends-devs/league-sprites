import gulp from 'gulp';
import babel from 'gulp-babel';
import runSequence from 'run-sequence';
import del from 'del';

gulp.task('clean', () => {
  return del([
    'lib'
  ]);
});

gulp.task('build', () => {
  return gulp.src('src/**/*.js')
  .pipe(babel({
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }))
  .pipe(gulp.dest('lib'));
});

gulp.task('default', (callback) => {
  runSequence(
    'clean',
    'build',
    callback
  );
});
