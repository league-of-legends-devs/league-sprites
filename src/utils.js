import Promise from 'bluebird';
import fs from 'graceful-fs';
import path from 'path';
import async from 'async';

function saveBuffersAsImages (list, folder, getDatasFromItem) {
  return new Promise((resolve, reject) => {
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
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export { saveBuffersAsImages };
