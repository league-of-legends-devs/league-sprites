import path from 'path';
import _ from 'lodash';
import { Client } from 'node-rest-client';
import debug from './log';
import config from './config';
const client = new Client();

const RIOT_API = 'global.api.pvp.net/api/lol/';

function linkAPI (route) {
  return config.protocol + '://' + path.join(RIOT_API, route);
};
function linkSource (url) {
  return config.protocol + '://' + url;
};

debug('Preparing data requests ...');

const datas = {
  'Champion': linkAPI('static-data/${region}/v1.2/champion'),
  'Item': linkAPI('static-data/${region}/v1.2/item'),
  'Patch': linkAPI('static-data/${region}/v1.2/versions'),
};
const sources = {
  'ChampionScreenArt': linkSource('ddragon.leagueoflegends.com/cdn/img/champion/loading/${champStringId}_${skinNumber}.jpg'),
  'ChampionIcon': linkSource('ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${champStringId}.png'),
  'PassiveAbilityIcon': linkSource('ddragon.leagueoflegends.com/cdn/${patch}/img/passive/${fileName}'),
  'ChampionAbilityIcon': linkSource('ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${fileName}'),
  'SummonerSpellIcon': linkSource('ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${fileName}'),
  'ItemIcon': linkSource('ddragon.leagueoflegends.com/cdn/${patch}/img/item/${id}.png'),
  'MasteryIcon': linkSource('ddragon.leagueoflegends.com/cdn/${patch}/img/mastery/${id}.png'),
  'RuneIcon': linkSource('ddragon.leagueoflegends.com/cdn/${patch}/img/rune/${id}.png')
};

_.keys(datas).forEach(function (dataName) {
  client.registerMethod('get' + dataName, datas[dataName], 'GET');
});
_.keys(sources).forEach(function (sourceName) {
  client.registerMethod('get' + sourceName, sources[sourceName], 'GET');
});

// Promisify the node client methods
_.keys(client.methods).forEach(method => {
  client.methods[method + 'Async'] = (...args) => new Promise((resolve, reject) => {
    try {
      client.methods[method](...args, (data, response) => {
        const [a] = args;
        resolve({ data: data, response: response, args: a });
      });
    } catch (e) {
      reject(e);
    }
  });
});

debug('Preparing data requests : done !');

function getDatas (dataName, args = {}) {
  let datas;
  try {
    datas = client.methods['get' + dataName + 'Async'](args);
  } catch (e) {
    debug(`(error) Getting ${dataName} datas : ${e}`);
  }
  return datas;
}

function getImage (sourceName, args) {
  let datas;
  try {
    datas = client.methods['get' + sourceName + 'Async'](args);
  } catch (e) {
    debug(`(error) Getting ${sourceName} image : ${e}`);
  }
  return datas;
}

export default { getImage, getDatas };
