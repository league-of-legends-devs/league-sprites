import Promise from 'bluebird';
import nsg from 'node-sprite-generator';
import debug from './log';

function generateSpriteSheet ({ src = [], spritePath, spriteLink, stylesheet = 'css', layout = 'packed', stylesheetPath }, compositorOptions) {
  return new Promise((resolve, reject) => {
    debug(`Generating sprite sheet from ${src} to ${spritePath} (${stylesheet} : ${stylesheetPath}) ...`);
    try {
      nsg({
        src: src,
        spritePath: spritePath,
        stylesheet: stylesheet,
        stylesheetPath: stylesheetPath,
        stylesheetOptions: {
          spritePath: spriteLink
        },
        layout: layout,
        compositorOptions: compositorOptions
      }, function done (err) {
        if (err) {
          debug(`(error) Generating sprite sheet : ${err}.`);
          reject(err);
          return;
        }
        debug(`Generating sprite sheet : done !`);
        resolve();
      });
    } catch (e) {
      debug(`(error) Generating sprite sheet : ${e}.`);
      reject(e);
    }
  });
}

export { generateSpriteSheet };
