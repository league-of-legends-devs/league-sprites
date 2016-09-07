import Promise from 'bluebird';
import fs from 'graceful-fs';
import path from 'path';
import async from 'async';
import debug from './log';

function saveBuffersAsImages (list, folder, getDatasFromItem) {
  return new Promise((resolve, reject) => {
    debug(`Saving images to ${folder} ...`);
    async.each(list, (image, callback) => {

      const buffer = getDatasFromItem(image).buffer;
      fs.open(path.join(folder, getDatasFromItem(image).name) + '.png', 'w', (err, fd) => {
        if (err) {
          callback(err);
        } else {
          fs.write(fd, buffer, 0, buffer.length, null, (err) => {
            if (err) {
              callback(err);
            } else {
              fs.close(fd, () => {
                callback();
              });
            }
          });
        }
      });

    }, (err) => {
      if (err) {
        debug(`(error) Saving images : ${err}`);
        reject(err);
      } else {
        debug(`Saving images : done !`);
        resolve();
      }
    });
  });
}

export { saveBuffersAsImages };
