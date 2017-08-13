# league-sprites

> Generate a complete spritesheet of all League of Legends sprites (champions, items ...) using the Riot API.

![stability-unstable](https://img.shields.io/badge/stability-unstable-yellow.svg)

[![npm version][version-badge]][version-url]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-url]
[![dependency status][dependency-badge]][dependency-url]
[![devdependency status][devdependency-badge]][devdependency-url]
[![downloads][downloads-badge]][downloads-url]

[![NPM][npm-stats-badge]][npm-stats-url]

## Installation

`npm install league-sprites --save`

**REQUIRED** : This project uses [node-canvas](https://github.com/Automattic/node-canvas) (from [node-sprite-generator](https://github.com/selaux/node-sprite-generator)).

Installation instructions [**here**](https://github.com/Automattic/node-canvas/wiki/_pages).

## How to use

```javascript
var SpriteGenerator = require('league-sprites').Generator;
var spritesGenerator = new SpriteGenerator({
  dataType: 'ChampionIcon', // accepted values : 'ChampionScreenArt', 'ChampionIcon' and 'ItemIcon'
  apiKey: 'KEY', // Riot API key
  region: 'euw',
  patch: undefined, // optional, will be retrived from the API if not provided
  stylesheetFormat: 'css', // 'css', 'sass', 'less' or 'stylus'
  stylesheetLayout: 'horizontal',
  downloadFolder: 'img/',
  spritePath: 'sprites/sprite.png',
  spriteLink: '', // Refer to 'spritePath' at https://github.com/selaux/node-sprite-generator#optionsstylesheetoptions
  stylesheetPath: 'sprites/sprite.css',
  finalSpritesheetFolder: 'sprites/compressed/',
  prod: false // Set to 'true' if running in a production environment
});

spritesGenerator.generate() // Returns a Promise
  .then(function () {
    console.log('Done !');
  })
  .catch(function (e) {
    console.error(e);
  });

// Using the ES7 synthax :
async function () {
  await spritesGenerator.generate();
}();
```

As this project uses node-sprite-generator and some parameters are directly passed to it. More infos [here](https://github.com/selaux/node-sprite-generator#options).

## Debug mode

To activate debug mode, set the `DEBUG` environment variable to `'league-sprites'`.

e.g. : `DEBUG=league-sprites node app.js`
(with _app.js_ using _league-sprites_)

## TODO

- [ ] Add the sources : `PassiveAbilityIco`, `ChampionAbilityIcon`, `SummonerSpellIcon`, `MasteryIcon` and `RuneIcon`.
- [ ] Generate datas about the sprites (sprite name, index ...) and pass them through the `Generator.generate().then(callback)` callback function.

## License

MIT License

Copyright (c) 2016-2017 **Nicolas COUTIN**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Anyway, if you earn money on my open source work, I will fucking end you :)

[version-badge]: https://img.shields.io/npm/v/league-sprites.svg
[version-url]: https://www.npmjs.com/package/league-sprites
[vulnerabilities-badge]: https://snyk.io/test/npm/league-sprites/badge.svg
[vulnerabilities-url]: https://snyk.io/test/npm/league-sprites
[dependency-badge]: https://david-dm.org/ilshidur/league-sprites.svg
[dependency-url]: https://david-dm.org/ilshidur/league-sprites
[devdependency-badge]: https://david-dm.org/ilshidur/league-sprites/dev-status.svg
[devdependency-url]: https://david-dm.org/ilshidur/league-sprites#info=devDependencies
[downloads-badge]: https://img.shields.io/npm/dt/league-sprites.svg
[downloads-url]: https://www.npmjs.com/package/league-sprites
[npm-stats-badge]: https://nodei.co/npm/league-sprites.png?downloads=true&downloadRank=true
[npm-stats-url]: https://nodei.co/npm/league-sprites
