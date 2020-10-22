# ng-pluralize #

[![npm](https://img.shields.io/npm/l/ng-pluralize.svg)](https://www.npmjs.com/package/ng-pluralize/)
[![npm](https://img.shields.io/npm/dt/ng-pluralize.svg)](https://www.npmjs.com/package/ng-pluralize)
[![npm](https://img.shields.io/npm/dm/ng-pluralize.svg)](https://www.npmjs.com/package/ng-pluralize)

![](example.gif)

## Index ##

* [About](#about)
* [Setup](#setup)
* [Usage](#usage)
* [Documentation](#documentation)
* [Contributing](#contributing)
* [Issues](#issues)
* [Deploy](#deploy)

## About ## 

An Angular 2+ module to pluralize and singularize any word.

* Try out [the demo](https://ng-pluralize.jrquick.com) to see it in action!
* Visit [my website](https://jrquick.com) for other cool projects!

## Setup ##

### Install Node ###

```
npm install ng-pluralize --save
```

### Import module ###

* Import `NgPluralizeModule` by adding the following to your parent module (i.e. `app.module.ts`):

    ```
    import { NgPluralizeModule } from 'ng-pluralize';

    @NgModule({
      ...
      imports: [
        NgPluralizeModule,
        ...
      ],
      ...
    })
    export class AppModule {}
    ```
  
## Usage ##

### Use Service ###

```typescript
import {NgPluralizeService} from 'ng-pluralize';

@Injectable()
export class TechCheckService {
  constructor(
    private service:NgPluralizeService
  ) {
    // Example: Singularize word
    this.service.singularize('dogs'); // dog

    // Example: Pluralize word 
    this.service.pluralize('cat'); // cats
  
    // Example: Singluralize or pluralize based on count
    this.service.fromCount('test', 0) //=> "tests"
    this.service.fromCount('test', 1) //=> "test"
    this.service.fromCount('test', 5) //=> "tests"
    this.service.fromCount('test', 1, true) //=> "1 test"
    this.service.fromCount('test', 5, true) //=> "5 tests"
    this.service.fromCount('蘋果', 2, true) //=> "2 蘋果"
    
    // Example of new plural rule:
    this.service.pluralize('regex') //=> "regexes"
    this.service.addPluralRule(/gex$/i, 'gexii')
    this.service.pluralize('regex') //=> "regexii"
    
    // Example of new singular rule:
    this.service.singularize('singles') //=> "single"
    this.service.addSingularRule(/singles$/i, 'singular')
    this.service.singularize('singles') //=> "singular"
    
    // Example of new irregular rule, e.g. "I" -> "we":
    this.service.pluralize('irregular') //=> "irregulars"
    this.service.addIrregularRule('irregular', 'regular')
    this.service.pluralize('irregular') //=> "regular"
    
    // Example of uncountable rule (rules without singular/plural in context):
    this.service.pluralize('paper') //=> "papers"
    this.service.addUncountableRule('paper')
    this.service.pluralize('paper') //=> "paper"
    
    // Example of asking whether a word looks singular or plural:
    this.service.isPlural('test') //=> false
    this.service.isSingular('test') //=> true
    
    // Example of adding a token exception whose case should not be restored:
    this.service.pluralize('promo ID') //=> 'promo IDS'
    this.service.addRestoreCaseException('IDs')
    this.service.pluralize('promo ID') //=> 'promo IDs'
  }
}
```

## Documentation ##

* `singularize()` - Convert a word into it's singular form (ie dogs to dog)
* `pluralize()` - Convert a word into it's plural form (ie cat to cats)
* `fromCount(word, count, inclusive)` - Get the current internet speed in KBPS (kilobytes per second).
    * `word: string` - The word to pluralize
    * `count: number` - How many of the word exist
    * `inclusive: boolean` - Whether to prefix with the number (e.g. 3 ducks)

## Contributing ##

### Thanks ###

* [blakeembrey](https://github.com/blakeembrey)
* [jrquick17](https://github.com/jrquick17)

## Issues ##

If you find any issues feel free to open a request in [the Issues tab](https://github.com/jrquick17/ng-pluralize/issues). If I have the time I will try to solve any issues but cannot make any guarantees. Feel free to contribute yourself.

## Deploy ##

### Demo ###
    
* Run `npm install` to get packages required for the demo and then run `npm run demo` to run locally.

### Generate Docs ###

* Run `npm run docs:build`

#### Update Version ###
    
* Update version `package.json` files in both the root and `dist/` directory following [Semantic Versioning (2.0.0)](https://semver.org/).

### Build ###

* Run `npm run build` from root.

#### Test ####

* Copy `dist/` contents into `demo/node_modules/ng-pluralize/`
    * Run from root:  `cp -fr dist/* demo/node_modules/ng-pluralize/`
* Run `ng serve` from `demo/`
* Run `ng build --prod` from `demo/`

#### NPM Release ####

* Run `npm publish` from `dist/` directory.

#### Update Changelog ####

* Add updates to `CHANGELOG.md` in root.

## License

MIT
