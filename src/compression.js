import Promise from 'bluebird';
import fs from 'graceful-fs';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';

function compressImages ({ src = [], out }, pngquantOpts, plugins = []) {
  return new Promise(async (resolve, reject) => {
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
    } catch (e) {
      reject(e);
    }
  });
}

export { compressImages };
