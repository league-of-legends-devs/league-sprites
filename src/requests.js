import _ from 'lodash';
import debug from './log';
import api from './api';

function getChampionScreenArt ({ region, apiKey }) {
  return new Promise(async (resolve, reject) => {
    debug('Requesting champions screen arts ...');
    if (!region || !apiKey) {
      reject(new Error('region and api key required.'));
      return;
    }
    try {
      const datas = await api.getDatas('Champion', { path: { 'region': region }, parameters: { 'api_key': apiKey } });
      debug('HTTP response code : ' + datas.response.statusCode + ' : ' + datas.response.statusMessage);
      const content = datas.data;
      let champsList = [];
      _.keys(content.data).forEach((champStringId) => {
        champsList.push({
          stringId: champStringId,
          data: content.data[champStringId]
        });
      });
      champsList = _.sortBy(champsList, 'stringId');
      let requests = [];
      for (let index in champsList) {
        requests.push(api.getImage('ChampionScreenArt', { path: { champStringId: champsList[index].stringId, skinNumber: 0 }, name: champsList[index].stringId }));
      }
      resolve(requests);
    } catch (e) {
      debug(`(error) Requesting champions screen arts : ${e}`);
      reject(e);
    }
  });
}

function getChampionIcons ({ region, apiKey, requestPatch }) {
  return new Promise(async (resolve, reject) => {
    debug('Requesting champions icons ...');
    if (!region || !apiKey || !requestPatch) {
      reject(new Error('region, api key and request patch required.'));
      return;
    }
    try {
      const datas = await api.getDatas('Champion', { path: { 'region': region }, parameters: { 'api_key': apiKey } });
      debug('HTTP response code : ' + datas.response.statusCode + ' : ' + datas.response.statusMessage);
      const content = datas.data;
      let champsList = [];
      _.keys(content.data).forEach((champStringId) => {
        champsList.push({
          stringId: champStringId,
          data: content.data[champStringId]
        });
      });
      champsList = _.sortBy(champsList, 'stringId');
      let requests = [];
      for (let index in champsList) {
        requests.push(api.getImage('ChampionIcon', { path: { patch: requestPatch, champStringId: champsList[index].stringId}, name: champsList[index].stringId }));
      }
      resolve(requests);
    } catch (e) {
      debug(`(error) Requesting champions icons : ${e}`);
      reject(e);
    }
  });
}

function generateRequests (dataType, args) {
  debug('HTTP response code : ' + `Requesting '${dataType}' data ...`);
  switch (dataType) {
    case 'ChampionScreenArt':
      return getChampionScreenArt(args);
      break;
    case 'ChampionIcon':
      return getChampionIcons(args);
      break;
    default:
      throw new Error('Invalid data type.');
  }
}

export { generateRequests };
