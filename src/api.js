import _ from 'lodash';
import { Client } from 'node-rest-client';
import KindredApi from 'kindred-api';
import debug from './log';

class Api {
  constructor(apiKey, region, prod = false) {
    debug('Initializing API');

    this.imagesSources = {
      /* eslint-disable no-template-curly-in-string */
      ChampionScreenArt: 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champStringId}_${skinNumber}.jpg',
      ChampionIcon: 'https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${champStringId}.png',
      PassiveAbilityIcon: 'https://ddragon.leagueoflegends.com/cdn/${patch}/img/passive/${fileName}',
      ChampionAbilityIcon: 'https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${fileName}',
      SummonerSpellIcon: 'https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${fileName}',
      ItemIcon: 'https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${id}.png',
      MasteryIcon: 'https://ddragon.leagueoflegends.com/cdn/${patch}/img/mastery/${id}.png',
      RuneIcon: 'https://ddragon.leagueoflegends.com/cdn/${patch}/img/rune/${id}.png',
      /* eslint-enable no-template-curly-in-string */
    };

    this.riotApi = new KindredApi.Kindred({
      key: apiKey,
      defaultRegion: region,
      debug: !prod,
      showKey: true,
      showHeaders: false,
      limits: prod ? KindredApi.LIMITS.PROD : KindredApi.LIMITS.DEV,
      spread: false,
      retryOptions: {
        auto: true,
        numberOfRetriesBeforeBreak: 3,
      },
      timeout: 5000,
    });

    this.restClient = new Client();
    _.keys(this.imagesSources).forEach(sourceName => this.restClient.registerMethod(`get${sourceName}`, this.imagesSources[sourceName], 'GET'));
    // Promisify the node client methods
    _.keys(this.restClient.methods).forEach((method) => {
      this.restClient.methods[`${method}Async`] = (...args) => new Promise((resolve, reject) => {
        try {
          this.restClient.methods[method](...args, (data, response) => {
            const [a] = args;
            resolve({ data, response, args: a });
          });
        } catch (e) {
          reject(e);
        }
      });
    });

    debug('Initialized API');
  }

  async getPatchVersion() {
    const patches = await this.riotApi.Static.versions();
    const patchVersion = _.first(patches);
    return patchVersion;
  }

  async getChampions() {
    const champions = await this.riotApi.Static.champions();
    return champions;
  }

  async getItems() {
    const items = await this.riotApi.Static.items();
    return items;
  }

  async generateImageRequests(dataType, patch) {
    debug(`Requesting '${dataType}' data ...`);
    let requests = [];
    switch (dataType) {
      case 'ChampionScreenArt':
        requests = await this.getChampionScreenArtRequests();
        break;
      case 'ChampionIcon':
        requests = await this.getChampionIconsRequests(patch);
        break;
      case 'ItemIcon':
        requests = await this.getItemIconsRequests(patch);
        break;
      default:
        throw new Error(`Invalid data type : ${dataType}`);
    }
    return {
      list: requests,
      execute: () => Promise.all(requests),
    };
  }

  async getChampionScreenArtRequests() {
    debug('Requesting champions screen arts ...');
    try {
      const champions = await this.getChampions();
      let champsList = [];
      _.keys(champions.data).forEach((champStringId) => {
        champsList.push({
          stringId: champStringId,
          data: champions.data[champStringId],
        });
      });
      champsList = _.sortBy(champsList, 'stringId');
      const requests = [];
      _.forEach(champsList, (champion) => {
        requests.push(this.getRiotImageRequests('ChampionScreenArt', { path: { champStringId: champion.stringId, skinNumber: 0 }, name: champion.stringId }));
      });
      return requests;
    } catch (e) {
      debug(`(error) Requesting champions screen arts : ${e}`);
      throw e;
    }
  }

  async getChampionIconsRequests(defaultPatch) {
    debug('Requesting champions icons ...');
    try {
      const champions = await this.getChampions();
      let champsList = [];
      _.keys(champions.data).forEach((champStringId) => {
        champsList.push({
          stringId: champStringId,
          data: champions.data[champStringId],
        });
      });
      champsList = _.sortBy(champsList, 'stringId');
      let patch = defaultPatch;
      if (!patch) {
        patch = await this.getPatchVersion();
      }
      const requests = [];
      _.forEach(champsList, (champion) => {
        requests.push(this.getRiotImageRequests('ChampionIcon', { path: { patch, champStringId: champion.stringId }, name: champion.stringId }));
      });
      return requests;
    } catch (e) {
      debug(`(error) Requesting champions icons : ${e}`);
      throw e;
    }
  }

  async getItemIconsRequests(defaultPatch) {
    debug('Requesting items icons ...');
    try {
      const items = await this.getItems();
      let itemsList = [];
      _.keys(items.data).forEach((itemStringId) => {
        itemsList.push({
          stringId: itemStringId,
          data: items.data[itemStringId],
        });
      });
      itemsList = _.sortBy(itemsList, 'stringId');
      let patch = defaultPatch;
      if (!patch) {
        patch = await this.getPatchVersion();
      }
      const requests = [];
      _.forEach(itemsList, (item) => {
        requests.push(this.getRiotImageRequests('ItemIcon', { path: { patch, id: item.stringId }, name: item.stringId }));
      });
      return requests;
    } catch (e) {
      debug(`(error) Requesting items icons : ${e}`);
      throw e;
    }
  }

  getRiotImageRequests(sourceName, args) {
    let request;
    try {
      request = this.restClient.methods[`get${sourceName}Async`](args);
    } catch (e) {
      debug(`(error) Getting ${sourceName} image : ${e}`);
    }
    return request;
  }
}

export default Api;
