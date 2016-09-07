import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';
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
    this.dataType = dataType;
    this.apiKey = apiKey;
    this.region = region;
    this.patch = patch;
    this.stylesheetFormat = stylesheetFormat;
    this.downloadFolder = downloadFolder;
    this.spritePath = spritePath;
    this.stylesheetPath = stylesheetPath;
  }

  generate () {
    return new Promise(async (resolve, reject) => {
      try {
        let requestPatch = this.patch;
        if (!this.patch) {
          console.log('No patch version. Requesting ...');
          let patchData = await api.getDatas('Patch', { parameters: { 'api_key': this.apiKey } });
          console.log(patchData.response.statusCode + ' : ' + patchData.response.statusMessage);
          requestPatch = patchData.data[0];
        }
        console.log('Patch version : ' + requestPatch);
        const requestsArgs = { region: this.region, apiKey: this.apiKey, requestPatch: requestPatch };
        const requests = await generateRequests(this.dataType, requestsArgs);
        console.log('Got ' + requests.length + ' requests to execute. Executing ...');
        const imageBuffers = await Promise.all(requests);
        console.log('Requests executed. Saving the images ...');
        await saveBuffersAsImages(imageBuffers, path.join(this.downloadFolder, this.dataType), (item) => { return { buffer: item.data, name: item.args.name }; } );
        console.log(imageBuffers.length + ' images downloaded !');
        await generateSpriteSheet({
          src: [path.join(this.downloadFolder, this.dataType, '*.png')],
          spritePath: this.spritePath,
          stylesheet: this.stylesheetFormat,
          stylesheetPath: this.stylesheetPath
        }, {
          compressionLevel: 9
        });
        console.log('Sprite generated !');
        await compressImages({
          src: [this.spritePath],
          out: this.finalSpritesheetFolder
        }, {
          speed: 1
        });
        console.log('Compressed images !');
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
