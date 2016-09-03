import Promise from 'bluebird';
import nsg from 'node-sprite-generator';

function generateSpriteSheet ({ src = [], spritePath, stylesheet = 'css', stylesheetPath }, compositorOptions) {
  return new Promise((resolve, reject) => {
    try {
      nsg({
        src: src,
        spritePath: spritePath,
        stylesheet: stylesheet,
        stylesheetPath: stylesheetPath,
        layout: 'packed',
        compositorOptions: compositorOptions
      }, function done (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}

export { generateSpriteSheet };
