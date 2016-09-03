import _ from 'lodash';
import api from './api';

function getChampionScreenArt ({ region, apiKey }) {
  return new Promise(async (resolve, reject) => {
    if (!region || !apiKey) {
      reject(new Error('region and api key required.'));
      return;
    }
    try {
      const datas = await api.getDatas('Champion', { path: { 'region': region }, parameters: { 'api_key': apiKey } });
      console.log(datas.response.statusCode + ' : ' + datas.response.statusMessage);
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
      reject(e);
    }
  });
}

function getChampionIcons ({ region, apiKey, requestPatch }) {
  return new Promise(async (resolve, reject) => {
    if (!region || !apiKey || !requestPatch) {
      reject(new Error('region, api key and request patch required.'));
      return;
    }
    try {
      const datas = await api.getDatas('Champion', { path: { 'region': region }, parameters: { 'api_key': apiKey } });
      console.log(datas.response.statusCode + ' : ' + datas.response.statusMessage);
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
      reject(e);
    }
  });
}

function generateRequests (dataType, args) {
  console.log(`Requesting '${dataType}' data ...`);
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
