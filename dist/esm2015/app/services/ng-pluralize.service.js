import { Injectable } from '@angular/core';
import { NgPluralizeUncountable } from '../vars/ng-pluralize-uncountable.var';
import { NgPluralizeSingularizationRules } from '../vars/ng-pluralize-singularization-rules.var';
import { NgPluralizePluralizationRules } from '../vars/ng-pluralize-pluralization-rules.var';
import { NgPluralizeIrregularRules } from "../vars/ng-pluralize-irregular-rules.var";
export class NgPluralizeService {
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
    _checkWord(replaceMap, keepMap, rules) {
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
    _interpolate(str, args) {
        return str.replace(/\$(\d{1,2})/g, (match, index) => {
            return args[index] || '';
        });
    }
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
    /**
     * Replace a word using a rule.
     *
     * @param  {string} word
     * @param  {Array}  rule
     * @return {string}
     */
    _replace(word, rule) {
        return word.replace(rule[0], function (match, index) {
            var result = this._interpolate(rule[1], arguments);
            if (match === '') {
                return this._restoreCase(word[index - 1], result);
            }
            return this._restoreCase(match, result);
        }.bind(this));
    }
    /**
     * Replace a word with the updated word.
     *
     * @param  {Object}   replaceMap
     * @param  {Object}   keepMap
     * @param  {Array}    rules
     * @return {Function}
     */
    _replaceWord(replaceMap, keepMap, rules) {
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
    _restoreCase(word, token) {
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
     * Sanitize a pluralization rule to a usable regular expression.
     *
     * @param  {(RegExp|string)} rule
     * @return {RegExp}
     */
    static _sanitizeRule(rule) {
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
    _sanitizeWord(token, word, rules) {
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
    }
    /**
     * Add a pluralization rule to the collection.
     *
     * @param {(string|RegExp)} rule
     * @param {string}          replacement
     */
    addPluralRule(rule, replacement) {
        this.pluralRules.push([NgPluralizeService._sanitizeRule(rule), replacement]);
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
        this.singularRules.push([NgPluralizeService._sanitizeRule(rule), replacement]);
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
    /**
     * Pluralize or singularize a word based on the passed in count.
     *
     * @param  {string}  word      The word to fromCount
     * @param  {number}  count     How many of the word exist
     * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
     * @return {string}
     */
    fromCount(word, count, inclusive) {
        var pluralized = count === 1
            ? this.singularize(word) : this.pluralize(word);
        return (inclusive ? count + ' ' : '') + pluralized;
    }
}
NgPluralizeService.decorators = [
    { type: Injectable }
];
NgPluralizeService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctcGx1cmFsaXplLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2pycXVpY2svZGV2ZWxvcG1lbnQvZW5jb3VudGluZy9uZy1wbHVyYWxpemUvc3JjLyIsInNvdXJjZXMiOlsiYXBwL3NlcnZpY2VzL25nLXBsdXJhbGl6ZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDNUUsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFDL0YsT0FBTyxFQUFDLDZCQUE2QixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDM0YsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFHbkYsTUFBTSxPQUFPLGtCQUFrQjtJQVE3QjtRQVBRLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLHFCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUN0QixxQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDdEIsMEJBQXFCLEdBQUcsRUFBRSxDQUFDO1FBMlFuQzs7OztXQUlHO1FBQ0ksY0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFckc7Ozs7V0FJRztRQUNJLGFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWxHOzs7O1dBSUc7UUFDSSxnQkFBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFD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Z0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDdkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUN6QyxDQUFDO0lBQUEsQ0FBQztJQUVGOzs7Ozs7O09BT0c7SUFDSSxTQUFTLENBQUMsSUFBVyxFQUFFLEtBQVksRUFBRSxTQUFpQjtRQUMzRCxJQUFJLFVBQVUsR0FBRyxLQUFLLEtBQUssQ0FBQztZQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsRCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDckQsQ0FBQzs7O1lBaFJGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge05nUGx1cmFsaXplVW5jb3VudGFibGV9IGZyb20gJy4uL3ZhcnMvbmctcGx1cmFsaXplLXVuY291bnRhYmxlLnZhcic7XG5pbXBvcnQge05nUGx1cmFsaXplU2luZ3VsYXJpemF0aW9uUnVsZXN9IGZyb20gJy4uL3ZhcnMvbmctcGx1cmFsaXplLXNpbmd1bGFyaXphdGlvbi1ydWxlcy52YXInO1xuaW1wb3J0IHtOZ1BsdXJhbGl6ZVBsdXJhbGl6YXRpb25SdWxlc30gZnJvbSAnLi4vdmFycy9uZy1wbHVyYWxpemUtcGx1cmFsaXphdGlvbi1ydWxlcy52YXInO1xuaW1wb3J0IHtOZ1BsdXJhbGl6ZUlycmVndWxhclJ1bGVzfSBmcm9tIFwiLi4vdmFycy9uZy1wbHVyYWxpemUtaXJyZWd1bGFyLXJ1bGVzLnZhclwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdQbHVyYWxpemVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBwbHVyYWxSdWxlcyA9IFtdO1xuICBwcml2YXRlIHNpbmd1bGFyUnVsZXMgPSBbXTtcbiAgcHJpdmF0ZSB1bmNvdW50YWJsZXMgPSB7fTtcbiAgcHJpdmF0ZSBpcnJlZ3VsYXJQbHVyYWxzID0ge307XG4gIHByaXZhdGUgaXJyZWd1bGFyU2luZ2xlcyA9IHt9O1xuICBwcml2YXRlIHJlc3RvcmVDYXNlRXhjZXB0aW9ucyA9IFtdO1xuICBcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fbG9hZFJ1bGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSB3b3JkIGlzIHBhcnQgb2YgdGhlIG1hcC5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrV29yZChyZXBsYWNlTWFwOmFueSwga2VlcE1hcDphbnksIHJ1bGVzOmFueSk6RnVuY3Rpb24ge1xuICAgIHJldHVybiAod29yZCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSB3b3JkLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmIChrZWVwTWFwLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcGxhY2VNYXAuaGFzT3duUHJvcGVydHkodG9rZW4pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3Nhbml0aXplV29yZCh0b2tlbiwgdG9rZW4sIHJ1bGVzKSA9PT0gdG9rZW47XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcnBvbGF0ZSBhIHJlZ2V4cCBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gICAqIEBwYXJhbSAge0FycmF5fSAgYXJnc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBwcml2YXRlIF9pbnRlcnBvbGF0ZShzdHI6c3RyaW5nLCBhcmdzOmFueSkge1xuICAgIHJldHVybiBzdHIucmVwbGFjZShcbiAgICAgIC9cXCQoXFxkezEsMn0pL2csXG4gICAgICAobWF0Y2gsIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiBhcmdzW2luZGV4XSB8fCAnJztcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfbG9hZFJ1bGVzKCkge1xuICAgIE5nUGx1cmFsaXplSXJyZWd1bGFyUnVsZXMuZm9yRWFjaChcbiAgICAgIChydWxlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZElycmVndWxhclJ1bGUocnVsZVswXSwgcnVsZVsxXSk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIE5nUGx1cmFsaXplU2luZ3VsYXJpemF0aW9uUnVsZXMuZm9yRWFjaChcbiAgICAgIChydWxlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNpbmd1bGFyUnVsZShydWxlWzBdLCBydWxlWzFdKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgTmdQbHVyYWxpemVQbHVyYWxpemF0aW9uUnVsZXMuZm9yRWFjaChcbiAgICAgIChydWxlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFBsdXJhbFJ1bGUocnVsZVswXSwgcnVsZVsxXSk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIC8qKlxuICAgICAqIFVuY291bnRhYmxlIHJ1bGVzLlxuICAgICAqL1xuICAgIE5nUGx1cmFsaXplVW5jb3VudGFibGUuZm9yRWFjaChcbiAgICAgIChydWxlKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkVW5jb3VudGFibGVSdWxlKHJ1bGUpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhIHdvcmQgdXNpbmcgYSBydWxlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHdvcmRcbiAgICogQHBhcmFtICB7QXJyYXl9ICBydWxlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIF9yZXBsYWNlKHdvcmQ6c3RyaW5nLCBydWxlOmFueSk6c3RyaW5nIHtcbiAgICByZXR1cm4gd29yZC5yZXBsYWNlKFxuICAgICAgcnVsZVswXSxcbiAgICAgIGZ1bmN0aW9uKG1hdGNoLCBpbmRleCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5faW50ZXJwb2xhdGUocnVsZVsxXSwgYXJndW1lbnRzKTtcblxuICAgICAgICBpZiAobWF0Y2ggPT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3RvcmVDYXNlKHdvcmRbaW5kZXggLSAxXSwgcmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9yZXN0b3JlQ2FzZShtYXRjaCwgcmVzdWx0KTtcbiAgICAgIH0uYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhIHdvcmQgd2l0aCB0aGUgdXBkYXRlZCB3b3JkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgcmVwbGFjZU1hcFxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAga2VlcE1hcFxuICAgKiBAcGFyYW0gIHtBcnJheX0gICAgcnVsZXNcbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuICBwcml2YXRlIF9yZXBsYWNlV29yZChyZXBsYWNlTWFwOmFueSwga2VlcE1hcDphbnksIHJ1bGVzOmFueSkge1xuICAgIHJldHVybiAod29yZCkgPT4ge1xuICAgICAgLy8gR2V0IHRoZSBjb3JyZWN0IHRva2VuIGFuZCBjYXNlIHJlc3RvcmF0aW9uIGZ1bmN0aW9ucy5cbiAgICAgIGNvbnN0IHRva2VuID0gd29yZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAvLyBDaGVjayBhZ2FpbnN0IHRoZSBrZWVwIG9iamVjdCBtYXAuXG4gICAgICBpZiAoa2VlcE1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3RvcmVDYXNlKHdvcmQsIHRva2VuKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgYWdhaW5zdCB0aGUgcmVwbGFjZW1lbnQgbWFwIGZvciBhIGRpcmVjdCB3b3JkIHJlcGxhY2VtZW50LlxuICAgICAgaWYgKHJlcGxhY2VNYXAuaGFzT3duUHJvcGVydHkodG9rZW4pKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXN0b3JlQ2FzZSh3b3JkLCByZXBsYWNlTWFwW3Rva2VuXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJ1biBhbGwgdGhlIHJ1bGVzIGFnYWluc3QgdGhlIHdvcmQuXG4gICAgICByZXR1cm4gdGhpcy5fc2FuaXRpemVXb3JkKHRva2VuLCB3b3JkLCBydWxlcyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXNzIGluIGEgd29yZCB0b2tlbiB0byBwcm9kdWNlIGEgZnVuY3Rpb24gdGhhdCBjYW4gcmVwbGljYXRlIHRoZSBjYXNlIG9uXG4gICAqIGFub3RoZXIgd29yZC5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHdvcmRcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHRva2VuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgcHJpdmF0ZSBfcmVzdG9yZUNhc2Uod29yZDpzdHJpbmcsIHRva2VuOnN0cmluZyk6c3RyaW5nIHtcbiAgICAvLyBEbyBub3QgcmVzdG9yZSB0aGUgY2FzZSBvZiBzcGVjaWZpZWQgdG9rZW5zXG4gICAgaWYgKHRoaXMucmVzdG9yZUNhc2VFeGNlcHRpb25zLmluZGV4T2YodG9rZW4pICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH1cblxuICAgIC8vIFRva2VucyBhcmUgYW4gZXhhY3QgbWF0Y2guXG4gICAgaWYgKHdvcmQgPT09IHRva2VuKSByZXR1cm4gdG9rZW47XG5cbiAgICAvLyBMb3dlciBjYXNlZCB3b3Jkcy4gRS5nLiBcImhlbGxvXCIuXG4gICAgaWYgKHdvcmQgPT09IHdvcmQudG9Mb3dlckNhc2UoKSkgcmV0dXJuIHRva2VuLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBVcHBlciBjYXNlZCB3b3Jkcy4gRS5nLiBcIldISVNLWVwiLlxuICAgIGlmICh3b3JkID09PSB3b3JkLnRvVXBwZXJDYXNlKCkpIHJldHVybiB0b2tlbi50b1VwcGVyQ2FzZSgpO1xuXG4gICAgLy8gVGl0bGUgY2FzZWQgd29yZHMuIEUuZy4gXCJUaXRsZVwiLlxuICAgIGlmICh3b3JkWzBdID09PSB3b3JkWzBdLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIHJldHVybiB0b2tlbi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRva2VuLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIC8vIExvd2VyIGNhc2VkIHdvcmRzLiBFLmcuIFwidGVzdFwiLlxuICAgIHJldHVybiB0b2tlbi50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhbml0aXplIGEgcGx1cmFsaXphdGlvbiBydWxlIHRvIGEgdXNhYmxlIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtICB7KFJlZ0V4cHxzdHJpbmcpfSBydWxlXG4gICAqIEByZXR1cm4ge1JlZ0V4cH1cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIF9zYW5pdGl6ZVJ1bGUocnVsZTpzdHJpbmd8UmVnRXhwKTpSZWdFeHAge1xuICAgIGlmICh0eXBlb2YgcnVsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHJ1bGUgKyAnJCcsICdpJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemUgYSB3b3JkIGJ5IHBhc3NpbmcgaW4gdGhlIHdvcmQgYW5kIHNhbml0aXphdGlvbiBydWxlcy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHRva2VuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB3b3JkXG4gICAqIEBwYXJhbSAge0FycmF5fSAgICBydWxlc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBwcml2YXRlIF9zYW5pdGl6ZVdvcmQodG9rZW46c3RyaW5nLCB3b3JkOnN0cmluZywgcnVsZXM6YW55KTpzdHJpbmcge1xuICAgIC8vIEVtcHR5IHN0cmluZyBvciBkb2Vzbid0IG5lZWQgZml4aW5nLlxuICAgIGlmICghdG9rZW4ubGVuZ3RoIHx8IHRoaXMudW5jb3VudGFibGVzLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgfVxuXG4gICAgdmFyIGxlbiA9IHJ1bGVzLmxlbmd0aDtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgc2FuaXRpemF0aW9uIHJ1bGVzIGFuZCB1c2UgdGhlIGZpcnN0IG9uZSB0byBtYXRjaC5cbiAgICB3aGlsZSAobGVuLS0pIHtcbiAgICAgIHZhciBydWxlID0gcnVsZXNbbGVuXTtcblxuICAgICAgaWYgKHJ1bGVbMF0udGVzdCh3b3JkKSkgcmV0dXJuIHRoaXMuX3JlcGxhY2Uod29yZCwgcnVsZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdvcmQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcGx1cmFsaXphdGlvbiBydWxlIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKX0gcnVsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgcmVwbGFjZW1lbnRcbiAgICovXG4gIHB1YmxpYyBhZGRQbHVyYWxSdWxlKHJ1bGUsIHJlcGxhY2VtZW50KSB7XG4gICAgdGhpcy5wbHVyYWxSdWxlcy5wdXNoKFtOZ1BsdXJhbGl6ZVNlcnZpY2UuX3Nhbml0aXplUnVsZShydWxlKSwgcmVwbGFjZW1lbnRdKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGFuIGV4Y2VwdGlvbiB0byByZXN0b3JlQ2FzZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4Y2VwdGlvblxuICAgKi9cblxuICBhZGRSZXN0b3JlQ2FzZUV4Y2VwdGlvbihleGNlcHRpb24pIHtcbiAgICB0aGlzLnJlc3RvcmVDYXNlRXhjZXB0aW9ucy5wdXNoKGV4Y2VwdGlvbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNpbmd1bGFyaXphdGlvbiBydWxlIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKX0gcnVsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgcmVwbGFjZW1lbnRcbiAgICovXG4gIGFkZFNpbmd1bGFyUnVsZShydWxlLCByZXBsYWNlbWVudCkge1xuICAgIHRoaXMuc2luZ3VsYXJSdWxlcy5wdXNoKFtOZ1BsdXJhbGl6ZVNlcnZpY2UuX3Nhbml0aXplUnVsZShydWxlKSwgcmVwbGFjZW1lbnRdKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGFuIHVuY291bnRhYmxlIHdvcmQgcnVsZS5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCl9IHdvcmRcbiAgICovXG4gIGFkZFVuY291bnRhYmxlUnVsZSh3b3JkKSB7XG4gICAgaWYgKHR5cGVvZiB3b3JkID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy51bmNvdW50YWJsZXNbd29yZC50b0xvd2VyQ2FzZSgpXSA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU2V0IHNpbmd1bGFyaXplIGFuZCBwbHVyYWxpemUgcmVmZXJlbmNlcyBmb3IgdGhlIHdvcmQuXG4gICAgdGhpcy5hZGRQbHVyYWxSdWxlKHdvcmQsICckMCcpO1xuICAgIHRoaXMuYWRkU2luZ3VsYXJSdWxlKHdvcmQsICckMCcpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gaXJyZWd1bGFyIHdvcmQgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNpbmdsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGx1cmFsXG4gICAqL1xuICBhZGRJcnJlZ3VsYXJSdWxlKHNpbmdsZSwgcGx1cmFsKSB7XG4gICAgcGx1cmFsID0gcGx1cmFsLnRvTG93ZXJDYXNlKCk7XG4gICAgc2luZ2xlID0gc2luZ2xlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmlycmVndWxhclNpbmdsZXNbc2luZ2xlXSA9IHBsdXJhbDtcbiAgICB0aGlzLmlycmVndWxhclBsdXJhbHNbcGx1cmFsXSA9IHNpbmdsZTtcbiAgfTtcblxuICAvKipcbiAgICogUGx1cmFsaXplIG9yIHNpbmd1bGFyaXplIGEgd29yZCBiYXNlZCBvbiB0aGUgcGFzc2VkIGluIGNvdW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICB3b3JkICAgICAgVGhlIHdvcmQgdG8gZnJvbUNvdW50XG4gICAqIEBwYXJhbSAge251bWJlcn0gIGNvdW50ICAgICBIb3cgbWFueSBvZiB0aGUgd29yZCBleGlzdFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBpbmNsdXNpdmUgV2hldGhlciB0byBwcmVmaXggd2l0aCB0aGUgbnVtYmVyIChlLmcuIDMgZHVja3MpXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHB1YmxpYyBmcm9tQ291bnQod29yZDpzdHJpbmcsIGNvdW50Om51bWJlciwgaW5jbHVzaXZlOmJvb2xlYW4pIHtcbiAgICB2YXIgcGx1cmFsaXplZCA9IGNvdW50ID09PSAxXG4gICAgICA/IHRoaXMuc2luZ3VsYXJpemUod29yZCkgOiB0aGlzLnBsdXJhbGl6ZSh3b3JkKTtcblxuICAgIHJldHVybiAoaW5jbHVzaXZlID8gY291bnQgKyAnICcgOiAnJykgKyBwbHVyYWxpemVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsdXJhbGl6ZSBhIHdvcmQuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHB1YmxpYyBwbHVyYWxpemUgPSB0aGlzLl9yZXBsYWNlV29yZCh0aGlzLmlycmVndWxhclNpbmdsZXMsIHRoaXMuaXJyZWd1bGFyUGx1cmFscywgdGhpcy5wbHVyYWxSdWxlcyk7XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgd29yZCBpcyBwbHVyYWxpemUuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHB1YmxpYyBpc1BsdXJhbCA9IHRoaXMuX2NoZWNrV29yZCh0aGlzLmlycmVndWxhclNpbmdsZXMsIHRoaXMuaXJyZWd1bGFyUGx1cmFscywgdGhpcy5wbHVyYWxSdWxlcyk7XG5cbiAgLyoqXG4gICAqIFNpbmd1bGFyaXplIGEgd29yZC5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgcHVibGljIHNpbmd1bGFyaXplID0gdGhpcy5fcmVwbGFjZVdvcmQodGhpcy5pcnJlZ3VsYXJQbHVyYWxzLCB0aGlzLmlycmVndWxhclNpbmdsZXMsIHRoaXMuc2luZ3VsYXJSdWxlcyk7XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgd29yZCBpcyBzaW5ndWxhcml6ZS5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgcHVibGljIGlzU2luZ3VsYXIgPSB0aGlzLl9jaGVja1dvcmQodGhpcy5pcnJlZ3VsYXJQbHVyYWxzLCB0aGlzLmlycmVndWxhclNpbmdsZXMsIHRoaXMuc2luZ3VsYXJSdWxlcyk7XG59XG4iXX0=