(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('ng-pluralize', ['exports', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ng-pluralize'] = {}, global.ng.core));
}(this, (function (exports, core) { 'use strict';

    /**
     * Irregular rules.
     */
    var NgPluralizeIrregularRules = [
        // Pronouns.
        ['I', 'we'],
        ['me', 'us'],
        ['he', 'they'],
        ['she', 'they'],
        ['them', 'them'],
        ['myself', 'ourselves'],
        ['yourself', 'yourselves'],
        ['itself', 'themselves'],
        ['herself', 'themselves'],
        ['himself', 'themselves'],
        ['themself', 'themselves'],
        ['is', 'are'],
        ['was', 'were'],
        ['has', 'have'],
        ['this', 'these'],
        ['that', 'those'],
        // Words ending in with a consonant and `o`.
        ['echo', 'echoes'],
        ['dingo', 'dingoes'],
        ['volcano', 'volcanoes'],
        ['tornado', 'tornadoes'],
        ['torpedo', 'torpedoes'],
        // Ends with `us`.
        ['genus', 'genera'],
        ['viscus', 'viscera'],
        // Ends with `ma`.
        ['stigma', 'stigmata'],
        ['stoma', 'stomata'],
        ['dogma', 'dogmata'],
        ['lemma', 'lemmata'],
        ['schema', 'schemata'],
        ['anathema', 'anathemata'],
        // Other irregular rules.
        ['ox', 'oxen'],
        ['axe', 'axes'],
        ['die', 'dice'],
        ['yes', 'yeses'],
        ['foot', 'feet'],
        ['eave', 'eaves'],
        ['goose', 'geese'],
        ['tooth', 'teeth'],
        ['quiz', 'quizzes'],
        ['human', 'humans'],
        ['proof', 'proofs'],
        ['carve', 'carves'],
        ['valve', 'valves'],
        ['looey', 'looies'],
        ['thief', 'thieves'],
        ['groove', 'grooves'],
        ['pickaxe', 'pickaxes'],
        ['passerby', 'passersby'],
        ['whiskey', 'whiskies']
    ];

    /**
     * Pluralization rules.
     */
    var NgPluralizePluralizationRules = [
        [/s?$/i, 's'],
        [/[^\u0000-\u007F]$/i, '$0'],
        [/([^aeiou]ese)$/i, '$1'],
        [/(ax|test)is$/i, '$1es'],
        [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'],
        [/(e[mn]u)s?$/i, '$1s'],
        [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'],
        [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
        [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
        [/(seraph|cherub)(?:im)?$/i, '$1im'],
        [/(her|at|gr)o$/i, '$1oes'],
        [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
        [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
        [/sis$/i, 'ses'],
        [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
        [/([^aeiouy]|qu)y$/i, '$1ies'],
        [/([^ch][ieo][ln])ey$/i, '$1ies'],
        [/(x|ch|ss|sh|zz)$/i, '$1es'],
        [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
        [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'],
        [/(pe)(?:rson|ople)$/i, '$1ople'],
        [/(child)(?:ren)?$/i, '$1ren'],
        [/eaux$/i, '$0'],
        [/m[ae]n$/i, 'men'],
        ['thou', 'you']
    ];

    /**
     * Singularization rules.
     */
    var NgPluralizeSingularizationRules = [
        [/s$/i, ''],
        [/(ss)$/i, '$1'],
        [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
        [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
        [/ies$/i, 'y'],
        [/(dg|ss|ois|lk|ok|wn|mb|th|ch|ec|oal|is|ck|ix|sser|ts|wb)ies$/i, '$1ie'],
        [/\b(l|(?:neck|cross|hog|aun)?t|coll|faer|food|gen|goon|group|hipp|junk|vegg|(?:pork)?p|charl|calor|cut)ies$/i, '$1ie'],
        [/\b(mon|smil)ies$/i, '$1ey'],
        [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
        [/(seraph|cherub)im$/i, '$1'],
        [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'],
        [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
        [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
        [/(test)(?:is|es)$/i, '$1is'],
        [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
        [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
        [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
        [/(alumn|alg|vertebr)ae$/i, '$1a'],
        [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
        [/(matr|append)ices$/i, '$1ix'],
        [/(pe)(rson|ople)$/i, '$1rson'],
        [/(child)ren$/i, '$1'],
        [/(eau)x?$/i, '$1'],
        [/men$/i, 'man']
    ];

    // Singular words with no plurals.
    var NgPluralizeUncountable = [
        'adulthood',
        'advice',
        'agenda',
        'aid',
        'aircraft',
        'alcohol',
        'ammo',
        'analytics',
        'anime',
        'athletics',
        'audio',
        'bison',
        'blood',
        'bream',
        'buffalo',
        'butter',
        'carp',
        'cash',
        'chassis',
        'chess',
        'clothing',
        'cod',
        'commerce',
        'cooperation',
        'corps',
        'debris',
        'diabetes',
        'digestion',
        'elk',
        'energy',
        'equipment',
        'excretion',
        'expertise',
        'firmware',
        'flounder',
        'fun',
        'gallows',
        'garbage',
        'graffiti',
        'hardware',
        'headquarters',
        'health',
        'herpes',
        'highjinks',
        'homework',
        'housework',
        'information',
        'jeans',
        'justice',
        'kudos',
        'labour',
        'literature',
        'machinery',
        'mackerel',
        'mail',
        'media',
        'mews',
        'moose',
        'music',
        'mud',
        'manga',
        'news',
        'only',
        'personnel',
        'pike',
        'plankton',
        'pliers',
        'police',
        'pollution',
        'premises',
        'rain',
        'research',
        'rice',
        'salmon',
        'scissors',
        'series',
        'sewage',
        'shambles',
        'shrimp',
        'species',
        'software',
        'staff',
        'swine',
        'tennis',
        'traffic',
        'transportation',
        'trout',
        'tuna',
        'wealth',
        'welfare',
        'whiting',
        'wildebeest',
        'wildlife',
        'you',
        /pok[eé]mon$/i,
        /[^aeiou]ese$/i,
        /deer$/i,
        /fish$/i,
        /measles$/i,
        /o[iu]s$/i,
        /pox$/i,
        /sheep$/i
    ];

    var NgPluralizeService = /** @class */ (function () {
        function NgPluralizeService() {
            this.pluralRules = [];
            this.singularRules = [];
            this.uncountables = {};
            this.irregularPlurals = {};
            this.irregularSingles = {};
            this.restoreCaseExceptions = [];
            /**
             * Pluralize a word.
             *
             * @type {Function}
             */
            this.pluralize = this._replaceWord(this.irregularSingles, this.irregularPlurals, this.pluralRules);
            /**
             * Check if a word is pluralize.
             *
             * @type {Function}
             */
            this.isPlural = this._checkWord(this.irregularSingles, this.irregularPlurals, this.pluralRules);
            /**
             * Singularize a word.
             *
             * @type {Function}
             */
            this.singularize = this._replaceWord(this.irregularPlurals, this.irregularSingles, this.singularRules);
            /**
             * Check if a word is singularize.
             *
             * @type {Function}
             */
            this.isSingular = this._checkWord(this.irregularPlurals, this.irregularSingles, this.singularRules);
            this._loadRules();
        }
        /**
         * Check if a word is part of the map.
         */
        NgPluralizeService.prototype._checkWord = function (replaceMap, keepMap, rules) {
            var _this = this;
            return function (word) {
                var token = word.toLowerCase();
                if (keepMap.hasOwnProperty(token)) {
                    return true;
                }
                if (replaceMap.hasOwnProperty(token)) {
                    return false;
                }
                return _this._sanitizeWord(token, token, rules) === token;
            };
        };
        /**
         * Interpolate a regexp string.
         *
         * @param  {string} str
         * @param  {Array}  args
         * @return {string}
         */
        NgPluralizeService.prototype._interpolate = function (str, args) {
            return str.replace(/\$(\d{1,2})/g, function (match, index) {
                return args[index] || '';
            });
        };
        NgPluralizeService.prototype._loadRules = function () {
            var _this = this;
            NgPluralizeIrregularRules.forEach(function (rule) {
                return _this.addIrregularRule(rule[0], rule[1]);
            });
            NgPluralizeSingularizationRules.forEach(function (rule) {
                return _this.addSingularRule(rule[0], rule[1]);
            });
            NgPluralizePluralizationRules.forEach(function (rule) {
                return _this.addPluralRule(rule[0], rule[1]);
            });
            /**
             * Uncountable rules.
             */
            NgPluralizeUncountable.forEach(function (rule) {
                _this.addUncountableRule(rule);
            });
        };
        /**
         * Replace a word using a rule.
         *
         * @param  {string} word
         * @param  {Array}  rule
         * @return {string}
         */
        NgPluralizeService.prototype._replace = function (word, rule) {
            return word.replace(rule[0], function (match, index) {
                var result = this._interpolate(rule[1], arguments);
                if (match === '') {
                    return this._restoreCase(word[index - 1], result);
                }
                return this._restoreCase(match, result);
            }.bind(this));
        };
        /**
         * Replace a word with the updated word.
         *
         * @param  {Object}   replaceMap
         * @param  {Object}   keepMap
         * @param  {Array}    rules
         * @return {Function}
         */
        NgPluralizeService.prototype._replaceWord = function (replaceMap, keepMap, rules) {
            var _this = this;
            return function (word) {
                // Get the correct token and case restoration functions.
                var token = word.toLowerCase();
                // Check against the keep object map.
                if (keepMap.hasOwnProperty(token)) {
                    return _this._restoreCase(word, token);
                }
                // Check against the replacement map for a direct word replacement.
                if (replaceMap.hasOwnProperty(token)) {
                    return _this._restoreCase(word, replaceMap[token]);
                }
                // Run all the rules against the word.
                return _this._sanitizeWord(token, word, rules);
            };
        };
        /**
         * Pass in a word token to produce a function that can replicate the case on
         * another word.
         *
         * @param  {string}   word
         * @param  {string}   token
         * @return {Function}
         */
        NgPluralizeService.prototype._restoreCase = function (word, token) {
            // Do not restore the case of specified tokens
            if (this.restoreCaseExceptions.indexOf(token) !== -1) {
                return token;
            }
            // Tokens are an exact match.
            if (word === token)
                return token;
            // Lower cased words. E.g. "hello".
            if (word === word.toLowerCase())
                return token.toLowerCase();
            // Upper cased words. E.g. "WHISKY".
            if (word === word.toUpperCase())
                return token.toUpperCase();
            // Title cased words. E.g. "Title".
            if (word[0] === word[0].toUpperCase()) {
                return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
            }
            // Lower cased words. E.g. "test".
            return token.toLowerCase();
        };
        /**
         * Sanitize a pluralization rule to a usable regular expression.
         *
         * @param  {(RegExp|string)} rule
         * @return {RegExp}
         */
        NgPluralizeService._sanitizeRule = function (rule) {
            if (typeof rule === 'string') {
                return new RegExp('^' + rule + '$', 'i');
            }
            return rule;
        };
        /**
         * Sanitize a word by passing in the word and sanitization rules.
         *
         * @param  {string}   token
         * @param  {string}   word
         * @param  {Array}    rules
         * @return {string}
         */
        NgPluralizeService.prototype._sanitizeWord = function (token, word, rules) {
            // Empty string or doesn't need fixing.
            if (!token.length || this.uncountables.hasOwnProperty(token)) {
                return word;
            }
            var len = rules.length;
            // Iterate over the sanitization rules and use the first one to match.
            while (len--) {
                var rule = rules[len];
                if (rule[0].test(word))
                    return this._replace(word, rule);
            }
            return word;
        };
        /**
         * Add a pluralization rule to the collection.
         *
         * @param {(string|RegExp)} rule
         * @param {string}          replacement
         */
        NgPluralizeService.prototype.addPluralRule = function (rule, replacement) {
            this.pluralRules.push([NgPluralizeService._sanitizeRule(rule), replacement]);
        };
        ;
        /**
         * Add an exception to restoreCase.
         *
         * @param {string} exception
         */
        NgPluralizeService.prototype.addRestoreCaseException = function (exception) {
            this.restoreCaseExceptions.push(exception);
        };
        ;
        /**
         * Add a singularization rule to the collection.
         *
         * @param {(string|RegExp)} rule
         * @param {string}          replacement
         */
        NgPluralizeService.prototype.addSingularRule = function (rule, replacement) {
            this.singularRules.push([NgPluralizeService._sanitizeRule(rule), replacement]);
        };
        ;
        /**
         * Add an uncountable word rule.
         *
         * @param {(string|RegExp)} word
         */
        NgPluralizeService.prototype.addUncountableRule = function (word) {
            if (typeof word === 'string') {
                this.uncountables[word.toLowerCase()] = true;
                return;
            }
            // Set singularize and pluralize references for the word.
            this.addPluralRule(word, '$0');
            this.addSingularRule(word, '$0');
        };
        ;
        /**
         * Add an irregular word definition.
         *
         * @param {string} single
         * @param {string} plural
         */
        NgPluralizeService.prototype.addIrregularRule = function (single, plural) {
            plural = plural.toLowerCase();
            single = single.toLowerCase();
            this.irregularSingles[single] = plural;
            this.irregularPlurals[plural] = single;
        };
        ;
        /**
         * Pluralize or singularize a word based on the passed in count.
         *
         * @param  {string}  word      The word to fromCount
         * @param  {number}  count     How many of the word exist
         * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
         * @return {string}
         */
        NgPluralizeService.prototype.fromCount = function (word, count, inclusive) {
            var pluralized = count === 1
                ? this.singularize(word) : this.pluralize(word);
            return (inclusive ? count + ' ' : '') + pluralized;
        };
        return NgPluralizeService;
    }());
    NgPluralizeService.decorators = [
        { type: core.Injectable }
    ];
    NgPluralizeService.ctorParameters = function () { return []; };

    var NgPluralizeModule = /** @class */ (function () {
        function NgPluralizeModule() {
        }
        return NgPluralizeModule;
    }());
    NgPluralizeModule.decorators = [
        { type: core.NgModule, args: [{
                    providers: [
                        NgPluralizeService
                    ]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.NgPluralizeIrregularRules = NgPluralizeIrregularRules;
    exports.NgPluralizeModule = NgPluralizeModule;
    exports.NgPluralizePluralizationRules = NgPluralizePluralizationRules;
    exports.NgPluralizeService = NgPluralizeService;
    exports.NgPluralizeSingularizationRules = NgPluralizeSingularizationRules;
    exports.NgPluralizeUncountable = NgPluralizeUncountable;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng-pluralize.umd.js.map
