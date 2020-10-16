export declare class PluralizeService {
    private pluralRules;
    private singularRules;
    private uncountables;
    private irregularPlurals;
    private irregularSingles;
    private restoreCaseExceptions;
    constructor();
    /**
     * Sanitize a pluralization rule to a usable regular expression.
     *
     * @param  {(RegExp|string)} rule
     * @return {RegExp}
     */
    sanitizeRule(rule: string | RegExp): RegExp;
    /**
     * Pass in a word token to produce a function that can replicate the case on
     * another word.
     *
     * @param  {string}   word
     * @param  {string}   token
     * @return {Function}
     */
    restoreCase(word: string, token: string): string;
    /**
     * Interpolate a regexp string.
     *
     * @param  {string} str
     * @param  {Array}  args
     * @return {string}
     */
    interpolate(str: string, args: any): string;
    /**
     * Replace a word using a rule.
     *
     * @param  {string} word
     * @param  {Array}  rule
     * @return {string}
     */
    replace(word: string, rule: any): string;
    /**
     * Sanitize a word by passing in the word and sanitization rules.
     *
     * @param  {string}   token
     * @param  {string}   word
     * @param  {Array}    rules
     * @return {string}
     */
    sanitizeWord(token: string, word: string, rules: any): string;
    /**
     * Replace a word with the updated word.
     *
     * @param  {Object}   replaceMap
     * @param  {Object}   keepMap
     * @param  {Array}    rules
     * @return {Function}
     */
    replaceWord(replaceMap: any, keepMap: any, rules: any): (word: any) => string;
    /**
     * Check if a word is part of the map.
     */
    checkWord(replaceMap: any, keepMap: any, rules: any): Function;
    /**
     * Pluralize or singularize a word based on the passed in count.
     *
     * @param  {string}  word      The word to fromCount
     * @param  {number}  count     How many of the word exist
     * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
     * @return {string}
     */
    pluralize(word: string, count: number, inclusive: boolean): string;
    /**
     * Pluralize a word.
     *
     * @type {Function}
     */
    plural: (word: any) => string;
    /**
     * Check if a word is pluralize.
     *
     * @type {Function}
     */
    isPlural: Function;
    /**
     * Singularize a word.
     *
     * @type {Function}
     */
    singular: (word: any) => string;
    /**
     * Check if a word is singularize.
     *
     * @type {Function}
     */
    isSingular: Function;
    /**
     * Add a pluralization rule to the collection.
     *
     * @param {(string|RegExp)} rule
     * @param {string}          replacement
     */
    addPluralRule(rule: any, replacement: any): void;
    /**
     * Add an exception to restoreCase.
     *
     * @param {string} exception
     */
    addRestoreCaseException(exception: any): void;
    /**
     * Add a singularization rule to the collection.
     *
     * @param {(string|RegExp)} rule
     * @param {string}          replacement
     */
    addSingularRule(rule: any, replacement: any): void;
    /**
     * Add an uncountable word rule.
     *
     * @param {(string|RegExp)} word
     */
    addUncountableRule(word: any): void;
    /**
     * Add an irregular word definition.
     *
     * @param {string} single
     * @param {string} plural
     */
    addIrregularRule(single: any, plural: any): void;
    private _loadRules;
}
