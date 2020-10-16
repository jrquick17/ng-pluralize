import {Injectable} from '@angular/core';

import {NgPluralizeUncountable} from '../vars/ng-pluralize-uncountable.var';
import {NgPluralizeSingularizationRules} from '../vars/ng-pluralize-singularization-rules.var';
import {NgPluralizePluralizationRules} from '../vars/ng-pluralize-pluralization-rules.var';
import {NgPluralizeIrregularRules} from "../vars/ng-pluralize-irregular-rules.var";

@Injectable()
export class PluralizeService {
  private pluralRules = [];
  private singularRules = [];
  private uncountables = {};
  private irregularPlurals = {};
  private irregularSingles = {};
  private restoreCaseExceptions = [];
  
  constructor() {
    this._loadRules();
  }

  /**
   * Check if a word is part of the map.
   */
  private _checkWord(replaceMap:any, keepMap:any, rules:any):Function {
    return (word) => {
      const token = word.toLowerCase();

      if (keepMap.hasOwnProperty(token)) {
        return true;
      }

      if (replaceMap.hasOwnProperty(token)) {
        return false;
      }

      return this._sanitizeWord(token, token, rules) === token;
    };
  }

  /**
   * Interpolate a regexp string.
   *
   * @param  {string} str
   * @param  {Array}  args
   * @return {string}
   */
  private _interpolate(str:string, args:any) {
    return str.replace(
      /\$(\d{1,2})/g,
      (match, index) => {
        return args[index] || '';
      }
    );
  }

  private _loadRules() {
    NgPluralizeIrregularRules.forEach(
      (rule) => {
        return this.addIrregularRule(rule[0], rule[1]);
      }
    );

    NgPluralizeSingularizationRules.forEach(
      (rule) => {
        return this.addSingularRule(rule[0], rule[1]);
      }
    );

    NgPluralizePluralizationRules.forEach(
      (rule) => {
        return this.addPluralRule(rule[0], rule[1]);
      }
    );

    /**
     * Uncountable rules.
     */
    NgPluralizeUncountable.forEach(
      (rule) => {
        this.addUncountableRule(rule);
      }
    );
  }

  /**
   * Replace a word using a rule.
   *
   * @param  {string} word
   * @param  {Array}  rule
   * @return {string}
   */
  _replace(word:string, rule:any):string {
    return word.replace(
      rule[0],
      function(match, index) {
        var result = this._interpolate(rule[1], arguments);

        if (match === '') {
          return this._restoreCase(word[index - 1], result);
        }

        return this._restoreCase(match, result);
      }.bind(this)
    );
  }

  /**
   * Replace a word with the updated word.
   *
   * @param  {Object}   replaceMap
   * @param  {Object}   keepMap
   * @param  {Array}    rules
   * @return {Function}
   */
  private _replaceWord(replaceMap:any, keepMap:any, rules:any) {
    return (word) => {
      // Get the correct token and case restoration functions.
      const token = word.toLowerCase();

      // Check against the keep object map.
      if (keepMap.hasOwnProperty(token)) {
        return this._restoreCase(word, token);
      }

      // Check against the replacement map for a direct word replacement.
      if (replaceMap.hasOwnProperty(token)) {
        return this._restoreCase(word, replaceMap[token]);
      }

      // Run all the rules against the word.
      return this._sanitizeWord(token, word, rules);
    };
  }

  /**
   * Pass in a word token to produce a function that can replicate the case on
   * another word.
   *
   * @param  {string}   word
   * @param  {string}   token
   * @return {Function}
   */
  private _restoreCase(word:string, token:string):string {
    // Do not restore the case of specified tokens
    if (this.restoreCaseExceptions.indexOf(token) !== -1) {
      return token;
    }

    // Tokens are an exact match.
    if (word === token) return token;

    // Lower cased words. E.g. "hello".
    if (word === word.toLowerCase()) return token.toLowerCase();

    // Upper cased words. E.g. "WHISKY".
    if (word === word.toUpperCase()) return token.toUpperCase();

    // Title cased words. E.g. "Title".
    if (word[0] === word[0].toUpperCase()) {
      return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
    }

    // Lower cased words. E.g. "test".
    return token.toLowerCase();
  }

  /**
   * Sanitize a pluralization rule to a usable regular expression.
   *
   * @param  {(RegExp|string)} rule
   * @return {RegExp}
   */
  private static _sanitizeRule(rule:string|RegExp):RegExp {
    if (typeof rule === 'string') {
      return new RegExp('^' + rule + '$', 'i');
    }

    return rule;
  }

  /**
   * Sanitize a word by passing in the word and sanitization rules.
   *
   * @param  {string}   token
   * @param  {string}   word
   * @param  {Array}    rules
   * @return {string}
   */
  private _sanitizeWord(token:string, word:string, rules:any):string {
    // Empty string or doesn't need fixing.
    if (!token.length || this.uncountables.hasOwnProperty(token)) {
      return word;
    }

    var len = rules.length;

    // Iterate over the sanitization rules and use the first one to match.
    while (len--) {
      var rule = rules[len];

      if (rule[0].test(word)) return this._replace(word, rule);
    }

    return word;
  }

  /**
   * Add a pluralization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  public addPluralRule(rule, replacement) {
    this.pluralRules.push([PluralizeService._sanitizeRule(rule), replacement]);
  };

  /**
   * Add an exception to restoreCase.
   *
   * @param {string} exception
   */

  addRestoreCaseException(exception) {
    this.restoreCaseExceptions.push(exception);
  };

  /**
   * Add a singularization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  addSingularRule(rule, replacement) {
    this.singularRules.push([PluralizeService._sanitizeRule(rule), replacement]);
  };

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
  };

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
  };

  /**
   * Pluralize or singularize a word based on the passed in count.
   *
   * @param  {string}  word      The word to fromCount
   * @param  {number}  count     How many of the word exist
   * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
   * @return {string}
   */
  public fromCount(word:string, count:number, inclusive:boolean) {
    var pluralized = count === 1
      ? this.singularize(word) : this.pluralize(word);

    return (inclusive ? count + ' ' : '') + pluralized;
  }

  /**
   * Pluralize a word.
   *
   * @type {Function}
   */
  public pluralize = this._replaceWord(this.irregularSingles, this.irregularPlurals, this.pluralRules);

  /**
   * Check if a word is pluralize.
   *
   * @type {Function}
   */
  public isPlural = this._checkWord(this.irregularSingles, this.irregularPlurals, this.pluralRules);

  /**
   * Singularize a word.
   *
   * @type {Function}
   */
  public singularize = this._replaceWord(this.irregularPlurals, this.irregularSingles, this.singularRules);

  /**
   * Check if a word is singularize.
   *
   * @type {Function}
   */
  public isSingular = this._checkWord(this.irregularPlurals, this.irregularSingles, this.singularRules);
}
