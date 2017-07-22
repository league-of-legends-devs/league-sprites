import async from 'async';
import Promise from 'bluebird';
import fs from 'fs-extra';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import _ from 'lodash';
import nsg from 'node-sprite-generator';
import path from 'path';

import debug from './log';

function generateSpriteSheet({ src = [], spritePath, spriteLink, stylesheet = 'css', layout = 'packed', stylesheetPath }, compositorOptions) {
  return new Promise((resolve, reject) => {
    debug(`Generating sprite sheet from ${src} to ${spritePath} (${stylesheet} : ${stylesheetPath}) ...`);
    try {
      nsg({
        src,
        spritePath,
        stylesheet,
        stylesheetPath,
        stylesheetOptions: {
          spritePath: spriteLink,
        },
        layout,
        compositorOptions,
      }, (err) => {
        if (err) {
          debug(`(error) Generating sprite sheet : ${err}.`);
          reject(err);
          return;
        }
        debug('Generating sprite sheet : done !');
        resolve();
      });
    } catch (e) {
      debug(`(error) Generating sprite sheet : ${e}.`);
      reject(e);
    }
  });
}

function saveBuffersAsImages(list, folder, getDatasFromItem) {
  return new Promise((resolve, reject) => {
    debug(`Saving images to ${folder} ...`);
    async.each(list, (image, callback) => {
      const imageDatas = getDatasFromItem(image);
      const buffer = imageDatas.buffer;
      const imageName = `${imageDatas.name}.png`;

      fs.ensureDir(folder, (err) => { // TODO: Use Promise-based fs calls
        if (err) {
          callback(err);
        }
        fs.open(path.join(folder, imageName), 'w', (openErr, fd) => {
          if (openErr) {
            callback(openErr);
          } else {
            fs.write(fd, buffer, 0, buffer.length, null, (writeErr) => {
              if (writeErr) {
                callback(writeErr);
              } else {
                fs.close(fd, () => {
                  callback();
                });
              }
            });
          }
        });
      });
    }, (err) => {
      if (err) {
        debug(`(error) Saving images : ${err}`);
        reject(err);
      } else {
        debug('Saving images : done !');
        resolve();
      }
    });
  });
}

function compressImages({ src = [], out }, pngquantOpts, plugins = []) {
  return new Promise(async (resolve, reject) => {
    debug(`Compressing images from ${src} to ${out} ...`);
    try {
      // Compress the images
      const files = await imagemin(src, out, {
        plugins: [
          imageminPngquant(pngquantOpts),
          ...plugins,
        ],
      });
      // Output the images
      // TODO: Test without this code below
      _.forEach(files, (file) => {
        fs.open(file.path, 'w', (err, fd) => {
          if (err) {
            reject(err);
            return;
          }
          const buffer = file.data;
          fs.write(fd, buffer, 0, buffer.length, null, (writeErr) => {
            if (writeErr) {
              reject(writeErr);
              return;
            }
            fs.close(fd, () => {
              resolve();
            });
          });
        });
      });
      debug('Compressing images : done !');
    } catch (e) {
      debug(`(error) Compressing images : ${e}`);
      reject(e);
    }
  });
}

export { generateSpriteSheet, saveBuffersAsImages, compressImages };
