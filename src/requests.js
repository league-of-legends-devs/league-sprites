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
        requests.push(api.getImage('ChampionIcon', { path: { patch: requestPatch, champStringId: champsList[index].stringId }, name: champsList[index].stringId }));
      }
      resolve(requests);
    } catch (e) {
      debug(`(error) Requesting champions icons : ${e}`);
      reject(e);
    }
  });
}

function getItemIcons ({ region, apiKey, requestPatch }) {
  return new Promise(async (resolve, reject) => {
    debug('Requesting items icons ...');
    if (!region || !apiKey || !requestPatch) {
      reject(new Error('region, api key and request patch required.'));
      return;
    }
    try {
      const datas = await api.getDatas('Item', { path: { 'region': region }, parameters: { 'api_key': apiKey } });
      debug('HTTP response code : ' + datas.response.statusCode + ' : ' + datas.response.statusMessage);
      const content = datas.data;
      let itemsList = [];
      _.keys(content.data).forEach((itemStringId) => {
        itemsList.push({
          stringId: itemStringId,
          data: content.data[itemStringId]
        });
      });
      itemsList = _.sortBy(itemsList, 'stringId');
      let requests = [];
      for (let index in itemsList) {
        requests.push(api.getImage('ItemIcon', { path: { patch: requestPatch, id: itemsList[index].stringId }, name: itemsList[index].stringId }));
      }
      resolve(requests);
    } catch (e) {
      debug(`(error) Requesting items icons : ${e}`);
      reject(e);
    }
  });
}

function generateRequests (dataType, args) {
  debug(`Requesting '${dataType}' data ...`);
  switch (dataType) {
    case 'ChampionScreenArt':
      return getChampionScreenArt(args);
      break;
    case 'ChampionIcon':
      return getChampionIcons(args);
      break;
    case 'ItemIcon':
      return getItemIcons(args);
      break;
    default:
      throw new Error(`Invalid data type : ${dataType}`);
  }
}

export { generateRequests };
