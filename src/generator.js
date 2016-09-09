import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';
import debug from './log';
import api from './api';
import { generateRequests } from './requests';
import { saveBuffersAsImages } from './utils';
import { generateSpriteSheet } from './sprites';
import { compressImages } from './compression';

class Generator {
  constructor ({
    dataType,
    apiKey,
    region = 'na',
    patch,
    stylesheetFormat = 'css',
    downloadFolder = 'img/',
    spritePath = 'out/sprite.png',
    spriteLink,
    stylesheetPath = 'out/sprite.css',
    finalSpritesheetFolder = 'out/compressed/'
  }) {
    debug('Initializing a new generator ...');
    this.dataType = dataType;
    this.apiKey = apiKey;
    this.region = region;
    this.patch = patch;
    this.stylesheetFormat = stylesheetFormat;
    this.downloadFolder = downloadFolder;
    this.spritePath = spritePath;
    this.spriteLink = spriteLink || spritePath;
    this.stylesheetPath = stylesheetPath;
    this.finalSpritesheetFolder = finalSpritesheetFolder;
    debug('Initializing a new generator : done !');
  }

  generate () {
    return new Promise(async (resolve, reject) => {
      const self = this;
      try {
        debug('Generating ...');
        let requestPatch = self.patch;
        if (!self.patch) {
          debug('No patch version. Requesting ...');
          let patchData = await api.getDatas('Patch', { parameters: { 'api_key': self.apiKey } });
          debug(patchData.response.statusCode + ' : ' + patchData.response.statusMessage);
          requestPatch = patchData.data[0];
        }
        debug('Patch version : ' + requestPatch);
        const requestsArgs = { region: self.region, apiKey: self.apiKey, requestPatch: requestPatch };
        const requests = await generateRequests(self.dataType, requestsArgs);
        debug('Got ' + requests.length + ' requests to execute. Executing ...');
        const imageBuffers = await Promise.all(requests);
        debug('Requests executed. Saving the images ...');
        await saveBuffersAsImages(imageBuffers, path.join(self.downloadFolder, self.dataType), (item) => { return { buffer: item.data, name: item.args.name }; } );
        debug(imageBuffers.length + ' images downloaded !');
        await generateSpriteSheet({
          src: [path.join(self.downloadFolder, self.dataType, '*.png')],
          spritePath: self.spritePath,
          spriteLink: self.spriteLink,
          stylesheet: self.stylesheetFormat,
          stylesheetPath: self.stylesheetPath
        }, {
          compressionLevel: 9
        });
        debug('Sprite generated !');
        await compressImages({
          src: [self.spritePath],
          out: self.finalSpritesheetFolder
        }, {
          speed: 1
        });
        debug('Compressed images !');
        debug('Generating : done !');
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default Generator;
