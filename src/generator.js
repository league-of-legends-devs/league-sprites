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
    this.stylesheetPath = stylesheetPath;
    debug('Initializing a new generator : done !');
  }

  generate () {
    return new Promise(async (resolve, reject) => {
      try {
        debug('Generating ...');
        let requestPatch = this.patch;
        if (!this.patch) {
          debug('No patch version. Requesting ...');
          let patchData = await api.getDatas('Patch', { parameters: { 'api_key': this.apiKey } });
          debug(patchData.response.statusCode + ' : ' + patchData.response.statusMessage);
          requestPatch = patchData.data[0];
        }
        debug('Patch version : ' + requestPatch);
        const requestsArgs = { region: this.region, apiKey: this.apiKey, requestPatch: requestPatch };
        const requests = await generateRequests(this.dataType, requestsArgs);
        debug('Got ' + requests.length + ' requests to execute. Executing ...');
        const imageBuffers = await Promise.all(requests);
        debug('Requests executed. Saving the images ...');
        await saveBuffersAsImages(imageBuffers, path.join(this.downloadFolder, this.dataType), (item) => { return { buffer: item.data, name: item.args.name }; } );
        debug(imageBuffers.length + ' images downloaded !');
        await generateSpriteSheet({
          src: [path.join(this.downloadFolder, this.dataType, '*.png')],
          spritePath: this.spritePath,
          stylesheet: this.stylesheetFormat,
          stylesheetPath: this.stylesheetPath
        }, {
          compressionLevel: 9
        });
        debug('Sprite generated !');
        await compressImages({
          src: [this.spritePath],
          out: this.finalSpritesheetFolder
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
