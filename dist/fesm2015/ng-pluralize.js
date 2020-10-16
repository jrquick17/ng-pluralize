import { Injectable, NgModule } from '@angular/core';

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

class PluralizeService {
    constructor() {
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
        this.plural = this.replaceWord(this.irregularSingles, this.irregularPlurals, this.pluralRules);
        /**
         * Check if a word is pluralize.
         *
         * @type {Function}
         */
        this.isPlural = this.checkWord(this.irregularSingles, this.irregularPlurals, this.pluralRules);
        /**
         * Singularize a word.
         *
         * @type {Function}
         */
        this.singular = this.replaceWord(this.irregularPlurals, this.irregularSingles, this.singularRules);
        /**
         * Check if a word is singularize.
         *
         * @type {Function}
         */
        this.isSingular = this.checkWord(this.irregularPlurals, this.irregularSingles, this.singularRules);
        this._loadRules();
    }
    /**
     * Sanitize a pluralization rule to a usable regular expression.
     *
     * @param  {(RegExp|string)} rule
     * @return {RegExp}
     */
    sanitizeRule(rule) {
        if (typeof rule === 'string') {
            return new RegExp('^' + rule + '$', 'i');
        }
        return rule;
    }
    /**
     * Pass in a word token to produce a function that can replicate the case on
     * another word.
     *
     * @param  {string}   word
     * @param  {string}   token
     * @return {Function}
     */
    restoreCase(word, token) {
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
    }
    /**
     * Interpolate a regexp string.
     *
     * @param  {string} str
     * @param  {Array}  args
     * @return {string}
     */
    interpolate(str, args) {
        return str.replace(/\$(\d{1,2})/g, (match, index) => {
            return args[index] || '';
        });
    }
    /**
     * Replace a word using a rule.
     *
     * @param  {string} word
     * @param  {Array}  rule
     * @return {string}
     */
    replace(word, rule) {
        return word.replace(rule[0], function (match, index) {
            var result = this.interpolate(rule[1], arguments);
            if (match === '') {
                return this.restoreCase(word[index - 1], result);
            }
            return this.restoreCase(match, result);
        }.bind(this));
    }
    /**
     * Sanitize a word by passing in the word and sanitization rules.
     *
     * @param  {string}   token
     * @param  {string}   word
     * @param  {Array}    rules
     * @return {string}
     */
    sanitizeWord(token, word, rules) {
        // Empty string or doesn't need fixing.
        if (!token.length || this.uncountables.hasOwnProperty(token)) {
            return word;
        }
        var len = rules.length;
        // Iterate over the sanitization rules and use the first one to match.
        while (len--) {
            var rule = rules[len];
            if (rule[0].test(word))
                return this.replace(word, rule);
        }
        return word;
    }
    /**
     * Replace a word with the updated word.
     *
     * @param  {Object}   replaceMap
     * @param  {Object}   keepMap
     * @param  {Array}    rules
     * @return {Function}
     */
    replaceWord(replaceMap, keepMap, rules) {
        return (word) => {
            // Get the correct token and case restoration functions.
            const token = word.toLowerCase();
            // Check against the keep object map.
            if (keepMap.hasOwnProperty(token)) {
                return this.restoreCase(word, token);
            }
            // Check against the replacement map for a direct word replacement.
            if (replaceMap.hasOwnProperty(token)) {
                return this.restoreCase(word, replaceMap[token]);
            }
            // Run all the rules against the word.
            return this.sanitizeWord(token, word, rules);
        };
    }
    /**
     * Check if a word is part of the map.
     */
    checkWord(replaceMap, keepMap, rules) {
        return (word) => {
            const token = word.toLowerCase();
            if (keepMap.hasOwnProperty(token)) {
                return true;
            }
            if (replaceMap.hasOwnProperty(token)) {
                return false;
            }
            return this.sanitizeWord(token, token, rules) === token;
        };
    }
    /**
     * Pluralize or singularize a word based on the passed in count.
     *
     * @param  {string}  word      The word to fromCount
     * @param  {number}  count     How many of the word exist
     * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
     * @return {string}
     */
    pluralize(word, count, inclusive) {
        var pluralized = count === 1
            ? this.singularize(word) : this.pluralize(word);
        return (inclusive ? count + ' ' : '') + pluralized;
    }
    /**
     * Add a pluralization rule to the collection.
     *
     * @param {(string|RegExp)} rule
     * @param {string}          replacement
     */
    addPluralRule(rule, replacement) {
        this.pluralRules.push([this.sanitizeRule(rule), replacement]);
    }
    ;
    /**
     * Add an exception to restoreCase.
     *
     * @param {string} exception
     */
    addRestoreCaseException(exception) {
        this.restoreCaseExceptions.push(exception);
    }
    ;
    /**
     * Add a singularization rule to the collection.
     *
     * @param {(string|RegExp)} rule
     * @param {string}          replacement
     */
    addSingularRule(rule, replacement) {
        this.singularRules.push([this.sanitizeRule(rule), replacement]);
    }
    ;
    /**
     * Add an uncountable word rule.
     *
     * @param {(string|RegExp)} word
     */
    addUncountableRule(word) {
        if (typeof word === 'string') {
            this.uncountables[word.toLowerCase()] = true;
            return;
        }
        // Set singularize and pluralize references for the word.
        this.addPluralRule(word, '$0');
        this.addSingularRule(word, '$0');
    }
    ;
    /**
     * Add an irregular word definition.
     *
     * @param {string} single
     * @param {string} plural
     */
    addIrregularRule(single, plural) {
        plural = plural.toLowerCase();
        single = single.toLowerCase();
        this.irregularSingles[single] = plural;
        this.irregularPlurals[plural] = single;
    }
    ;
    _loadRules() {
        NgPluralizeIrregularRules.forEach((rule) => {
            return this.addIrregularRule(rule[0], rule[1]);
        });
        NgPluralizeSingularizationRules.forEach((rule) => {
            return this.addSingularRule(rule[0], rule[1]);
        });
        NgPluralizePluralizationRules.forEach((rule) => {
            return this.addPluralRule(rule[0], rule[1]);
        });
        /**
         * Uncountable rules.
         */
        NgPluralizeUncountable.forEach((rule) => {
            this.addUncountableRule(rule);
        });
    }
}
PluralizeService.decorators = [
    { type: Injectable }
];
PluralizeService.ctorParameters = () => [];

class NgPluralizeModule {
}
NgPluralizeModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    PluralizeService
                ]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { NgPluralizeIrregularRules, NgPluralizeModule, NgPluralizePluralizationRules, NgPluralizeSingularizationRules, NgPluralizeUncountable, PluralizeService };
//# sourceMappingURL=ng-fromCount.js.map
