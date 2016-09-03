import path from 'path';
import _ from 'lodash';
import { Client } from 'node-rest-client';
import config from './config';
const client = new Client();

const RIOT_API = 'global.api.pvp.net/api/lol/';

function linkAPI (route) {
  return config.protocol + '://' + path.join(RIOT_API, route);
};
function linkSource (url) {
  return config.protocol + '://' + url;
};

const datas = {
  'Champion': linkAPI('static-data/${region}/v1.2/champion'),
  'Patch': linkAPI('/static-data/euw/v1.2/versions'),
};

_.keys(datas).forEach(function (dataName) {
  client.registerMethod('get' + dataName, datas[dataName], 'GET');
});

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

function getDatas (dataName, args = {}) {
  return client.methods['get' + dataName + 'Async'](args);
}

function getImage (sourceName, args) {
  return client.methods['get' + sourceName + 'Async'](args);
}

export default { getImage, getDatas };
