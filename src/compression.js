import Promise from 'bluebird';
import fs from 'graceful-fs';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import debug from './log';

function compressImages ({ src = [], out }, pngquantOpts, plugins = []) {
  return new Promise(async (resolve, reject) => {
    debug(`Compressing images from ${src} to ${out} ...`);
    try {
      // Compress the images
      const files = await imagemin(src, out, {
        plugins: [
          imageminPngquant(pngquantOpts),
          ...plugins
        ]
      });
      // Output the images
      // TODO: Test without this code below
      for (let file of files) {
        fs.open(file.path, 'w', (err, fd) => {
          if (err) {
            reject(err);
            return;
          }
          const buffer = file.data;
          fs.write(fd, buffer, 0, buffer.length, null, (err) => {
            if (err) {
              reject(err);
              return;
            }
            fs.close(fd, () => {
              resolve();
            });
          });
        });
      }
      debug('Compressing images : done !');
    } catch (e) {
      debug('(error) Compressing images : ' + e);
      reject(e);
    }
  });
}

export { compressImages };
