import path from 'path';
import Promise from 'bluebird';
import debug from './log';
import Api from './api';
import { saveBuffersAsImages, generateSpriteSheet, compressImages } from './utils';

// Layout :
// 'packed': Bin-packing Layout
// 'vertical': Vertically aligned layout
// 'horizontal': Horizontally aligned layout
// 'diagonal': Diagonally aligned layout

class Generator {
  constructor({
    dataType,
    apiKey,
    region = 'na',
    patch,
    stylesheetFormat = 'css',
    stylesheetLayout,
    downloadFolder = 'img/',
    spritePath = 'out/sprite.png',
    spriteLink,
    stylesheetPath = 'out/sprite.css',
    finalSpritesheetFolder = 'out/compressed/',
    prod = false,
  }) {
    debug('Initializing a new generator ...');
    this.dataType = dataType;
    this.api = new Api(apiKey, region, prod);
    this.patch = patch;
    this.stylesheetFormat = stylesheetFormat;
    this.stylesheetLayout = stylesheetLayout;
    this.downloadFolder = downloadFolder;
    this.spritePath = spritePath;
    this.spriteLink = spriteLink || spritePath;
    this.stylesheetPath = stylesheetPath;
    this.finalSpritesheetFolder = finalSpritesheetFolder;
    debug('Initializing a new generator : done !');
  }

  async _getPatchVersion() {
    if (!this.patch) {
      debug('No patch version. Requesting ...');
      this.patch = await this.api.getPatchVersion();
      debug(`Patch version', ${this.patch}`);
    }
  }

  async _downloadImages() {
    const imageRequests = await this.api.generateImageRequests(this.dataType, this.patch);
    debug(`Got ${imageRequests.list.length} requests to execute. Executing ...`);
    const imageBuffers = await imageRequests.execute();
    debug('Requests executed. Saving the images ...');
    await saveBuffersAsImages(
      imageBuffers,
      path.join(this.downloadFolder, this.dataType),
      item => ({ buffer: item.data, name: item.args.name }),
    );
    debug(`${imageBuffers.length} images downloaded !`);
  }

  async _generateSpriteSheets() {
    await generateSpriteSheet({
      src: [path.join(this.downloadFolder, this.dataType, '*.png')],
      spritePath: this.spritePath,
      spriteLink: this.spriteLink,
      stylesheet: this.stylesheetFormat,
      layout: this.stylesheetLayout,
      stylesheetPath: this.stylesheetPath,
    }, {
      compressionLevel: 9,
    });
    debug('Sprite generated !');
  }

  async _compressImages() {
    await compressImages({
      src: [this.spritePath],
      out: this.finalSpritesheetFolder,
    }, {
      speed: 1,
    });
    debug('Compressed images !');
  }

  generate() {
    return new Promise(async (resolve, reject) => {
      try {
        debug('Generating ...');

        /* eslint-disable no-underscore-dangle */
        await this._getPatchVersion();
        await this._downloadImages();
        await this._generateSpriteSheets();
        await this._compressImages();
        /* eslint-enable no-underscore-dangle */

        debug('Generating : done !');
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default Generator;
