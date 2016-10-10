# league-sprites ([npm link](https://www.npmjs.com/package/league-sprites))
Generate a complete spritesheet of all League of Legends sprites (champions, items ...) using the Riot API.

## Installation

`npm install league-sprites --save`

**REQUIRED** : This project uses [node-canvas](https://github.com/Automattic/node-canvas) (from [node-sprite-generator](https://github.com/selaux/node-sprite-generator)).

Installation instructions [**here**](https://github.com/Automattic/node-canvas/wiki/_pages).

## How to use

```javascript
var SpriteGenerator = require('league-sprites').Generator;
var spritesGenerator = new SpriteGenerator({
  dataType: 'ChampionIcons', // accepted values : 'ChampionScreenArt', 'ChampionIcon' and 'ItemIcon'
  apiKey: 'API_KEY',
  region: 'euw',
  patch: undefined, // optional, will be retrived from the API if not provided
  stylesheetFormat: 'css', // 'css', 'sass', 'less' or 'stylus'
  downloadFolder: 'img/',
  spritePath: 'sprites/sprite.png',
  stylesheetPath: 'sprites/sprite.css',
  finalSpritesheetFolder: 'sprites/compressed/'
});

spritesGenerator.generate()
  .then(function () {
    console.log('Done !');
  })
  .catch(function (e) {
    console.error(e);
  });
```

As this project uses node-sprite-generator and some parameters are directly passed to it. More infos [here](https://github.com/selaux/node-sprite-generator#options).

## TODO

- [ ] Add the sources : `PassiveAbilityIco`, `ChampionAbilityIcon`, `SummonerSpellIcon`, `MasteryIcon` and `RuneIcon`.
- [ ] Generate datas about the sprites (sprite name, index ...) and pass them through the `Generator.generate().then(callback)` callback function.

## License

MIT License

Copyright (c) 2016 Ilshidur

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
